import httpx
import time
import uuid
import json
from fastapi import FastAPI, HTTPException, Header, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Annotated, Any

# --- Modelos de Datos ---
class ToolFunction(BaseModel):
    name: str
    description: str
    parameters: dict

class Tool(BaseModel):
    type: str = "function"
    function: ToolFunction

class ChatMessage(BaseModel):
    role: str
    content: str | None

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    tools: List[Tool] | None = None
    tool_choice: Any | None = None
    stream: bool | None = False

# --- Inicialización de FastAPI ---
app = FastAPI(
    title="Gemini API Connector",
    description="Adapta la API de Gemini para que sea compatible con el formato de OpenRouter/OpenAI, incluyendo Tool Calling y Streaming.",
    version="1.5.0",
)

# --- Funciones Auxiliares ---

def _sanitize_tool_parameters(params: Any):
    if isinstance(params, dict):
        params.pop("$schema", None)
        params.pop("additionalProperties", None)
        for key in list(params.keys()):
            _sanitize_tool_parameters(params[key])
    elif isinstance(params, list):
        for item in params:
            _sanitize_tool_parameters(item)

def _get_api_key(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Falta el encabezado de autorización o es inválido. Usa 'Authorization: Bearer TU_API_KEY'.",
        )
    return authorization.split(" ")[1]

# --- Endpoints ---

@app.get("/v1/models", tags=["Models"])
@app.get("/models", tags=["Models"], include_in_schema=False)
async def get_models(authorization: Annotated[str | None, Header()] = None):
    api_key = _get_api_key(authorization)
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(target_url)
            response.raise_for_status()
            gemini_data = response.json()
            
            openrouter_formatted_models = []
            for model in gemini_data.get("models", []):
                if "generateContent" in model.get("supportedGenerationMethods", []):
                    model_id = model.get("name").replace("models/", "")
                    openrouter_formatted_models.append({
                        "id": model_id, "name": model.get("displayName", model_id),
                        "description": model.get("description", ""),
                        "pricing": {"prompt": "0.0", "completion": "0.0", "request": "0.0", "image": "0.0"},
                        "context_length": model.get("inputTokenLimit", 8192),
                        "architecture": {"modality": "text", "tokenizer": "Google", "instruct_type": "text"},
                        "top_provider": {"max_temperature": model.get("temperature", 1.0), "is_moderated": False},
                        "per_request_limits": None, "created_at": int(time.time())
                    })
            
            final_response = {"data": openrouter_formatted_models}
            return Response(content=json.dumps(final_response), media_type="application/json")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error desde la API de Gemini: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ocurrió un error interno: {str(e)}")


async def stream_gemini_response(model_name: str, payload: dict, api_key: str):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:streamGenerateContent?key={api_key}"
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            async with client.post(url, json=payload) as response:
                response.raise_for_status()
                buffer = ""
                finish_reason = "stop"
                async for chunk in response.aiter_bytes():
                    buffer += chunk.decode('utf-8')
                    while '\n' in buffer:
                        line, buffer = buffer.split('\n', 1)
                        if line.startswith('data: '):
                            try:
                                data = json.loads(line[6:])
                                part = data["candidates"][0]["content"]["parts"][0]
                                if "functionCall" in part:
                                    function_call = part["functionCall"]
                                    tool_calls = [{"index": 0, "id": f"call_{uuid.uuid4()}", "type": "function", "function": {"name": function_call["name"], "arguments": json.dumps(function_call["args"])}}]
                                    delta = {"role": "assistant", "content": None, "tool_calls": tool_calls}
                                    finish_reason = "tool_calls"
                                else:
                                    delta = {"role": "assistant", "content": part.get("text", "")}
                                openai_chunk = {
                                    "id": f"chatcmpl-{uuid.uuid4()}", "object": "chat.completion.chunk",
                                    "created": int(time.time()), "model": model_name,
                                    "choices": [{"index": 0, "delta": delta, "finish_reason": None}]
                                }
                                yield f"data: {json.dumps(openai_chunk)}\n\n"
                            except (json.JSONDecodeError, KeyError, IndexError):
                                continue
            final_chunk = {
                "id": f"chatcmpl-{uuid.uuid4()}", "object": "chat.completion.chunk",
                "created": int(time.time()), "model": model_name,
                "choices": [{"index": 0, "delta": {}, "finish_reason": finish_reason}]
            }
            yield f"data: {json.dumps(final_chunk)}\n\n"
            yield "data: [DONE]\n\n"
        except httpx.HTTPStatusError as e:
            yield f"data: {json.dumps({'error': {'message': e.response.text}})}\n\n"
            yield "data: [DONE]\n\n"

@app.post("/v1/chat/completions", tags=["Chat"])
async def create_chat_completion(
    request: ChatCompletionRequest,
    authorization: Annotated[str | None, Header()] = None,
):
    api_key = _get_api_key(authorization)
    
    gemini_contents, system_prompts, user_and_model_messages = [], [], []
    for message in request.messages:
        if message.role == 'system':
            system_prompts.append(message.content)
        elif not (message.role == 'assistant' and message.content is None):
            user_and_model_messages.append(message)
    if system_prompts and user_and_model_messages and user_and_model_messages[0].role == 'user':
        user_and_model_messages[0].content = "\n".join(filter(None, system_prompts)) + "\n\n" + user_and_model_messages[0].content
    for message in user_and_model_messages:
        if message.content:
            gemini_contents.append({"role": "model" if message.role == "assistant" else "user", "parts": [{"text": message.content}]})
    if not any(c['role'] == 'user' for c in gemini_contents):
        raise HTTPException(status_code=400, detail="No se encontró un mensaje de rol 'user' válido.")

    gemini_payload = {"contents": gemini_contents}
    if request.tools:
        gemini_payload["tools"] = [{"functionDeclarations": [t.function.dict() for t in request.tools]}]
        for declaration in gemini_payload["tools"][0]["functionDeclarations"]:
            if "parameters" in declaration: _sanitize_tool_parameters(declaration["parameters"])
        if isinstance(request.tool_choice, dict) and "function" in request.tool_choice:
             gemini_payload["toolConfig"] = {"functionCallingConfig": {"mode": "ANY", "allowedFunctionNames": [request.tool_choice["function"]["name"]]}}

    if request.stream:
        return StreamingResponse(stream_gemini_response(request.model, gemini_payload, api_key), media_type="text/event-stream")
    
    # --- Lógica para respuestas SIN STREAMING (la que usará Dokploy) ---
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models/{request.model}:generateContent?key={api_key}"
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            response = await client.post(target_url, json=gemini_payload)
            response.raise_for_status()
            gemini_data = response.json()
            part = gemini_data["candidates"][0]["content"]["parts"][0]
            if "functionCall" in part:
                function_call = part["functionCall"]
                tool_calls = [{"id": f"call_{uuid.uuid4()}", "type": "function", "function": {"name": function_call["name"], "arguments": json.dumps(function_call["args"])}}]
                message = {"role": "assistant", "content": None, "tool_calls": tool_calls}
                finish_reason = "tool_calls"
            else:
                message = {"role": "assistant", "content": part.get("text", "")}
                finish_reason = "stop"
            
            openai_response = {
                "id": f"chatcmpl-{uuid.uuid4()}", "object": "chat.completion", "created": int(time.time()), "model": request.model,
                "choices": [{"index": 0, "message": message, "finish_reason": finish_reason}],
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            }
            return Response(content=json.dumps(openai_response), media_type="application/json")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error desde la API de Gemini: {e.response.text}")
        except (KeyError, IndexError):
            raise HTTPException(status_code=500, detail=f"Error al procesar la respuesta de Gemini: {gemini_data}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ocurrió un error interno: {str(e)}")

@app.get("/", tags=["Health"])
def read_root():
    return {"status": "ok"}

