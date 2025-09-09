import httpx
import time
import uuid
import json
from fastapi import FastAPI, HTTPException, Header, Response
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
    tool_choice: Any | None = None # Acepta "auto" o un objeto específico

# --- Inicialización de FastAPI ---
app = FastAPI(
    title="Gemini API Connector",
    description="Adapta la API de Gemini para que sea compatible con el formato de OpenRouter/OpenAI, incluyendo Tool Calling.",
    version="1.3.0",
)

# --- Endpoints ---

@app.get("/v1/models", tags=["Models"])
@app.get("/models", tags=["Models"], include_in_schema=False)
async def get_models(authorization: Annotated[str | None, Header()] = None):
    # (Este endpoint no necesita cambios, se mantiene igual)
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


@app.post("/v1/chat/completions", tags=["Chat"])
async def create_chat_completion(
    request: ChatCompletionRequest,
    authorization: Annotated[str | None, Header()] = None,
):
    api_key = _get_api_key(authorization)
    
    # 1. Preparar el payload para Gemini traduciendo todo el historial de mensajes
    gemini_contents = []
    # Gemini no tiene un rol 'system', así que fusionamos los prompts de sistema con el primer mensaje de usuario
    system_prompts = []
    user_and_model_messages = []

    for message in request.messages:
        if message.role == 'system':
            system_prompts.append(message.content)
        # Ignorar mensajes de asistente sin contenido (típico en peticiones de tool calling)
        elif message.role == 'assistant' and message.content is None:
            continue
        else:
            user_and_model_messages.append(message)

    # Prepend system prompts to the first user message content
    if system_prompts and user_and_model_messages and user_and_model_messages[0].role == 'user':
        full_first_prompt = "\n".join(filter(None, system_prompts)) + "\n\n" + user_and_model_messages[0].content
        user_and_model_messages[0].content = full_first_prompt

    for message in user_and_model_messages:
        role = "model" if message.role == "assistant" else "user"
        if message.content:
            gemini_contents.append({
                "role": role,
                "parts": [{"text": message.content}]
            })

    if not any(c['role'] == 'user' for c in gemini_contents):
        raise HTTPException(status_code=400, detail="No se encontró un mensaje de rol 'user' válido para enviar a Gemini.")

    gemini_payload = {"contents": gemini_contents}

    # 2. AÑADIR LAS HERRAMIENTAS (TOOLS) SI EXISTEN EN LA SOLICITUD
    if request.tools:
        gemini_payload["tools"] = [{"functionDeclarations": [t.function.dict() for t in request.tools]}]
        if isinstance(request.tool_choice, dict) and "function" in request.tool_choice:
             gemini_payload["toolConfig"] = {
                "functionCallingConfig": {
                    "mode": "ANY",
                    "allowedFunctionNames": [request.tool_choice["function"]["name"]]
                }
            }

    # 3. Realizar la llamada a Gemini
    model_name = request.model
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(target_url, json=gemini_payload)
            response.raise_for_status()
            gemini_data = response.json()

            # 4. TRADUCIR LA RESPUESTA DE VUELTA AL FORMATO OPENAI
            part = gemini_data["candidates"][0]["content"]["parts"][0]
            if "functionCall" in part:
                function_call = part["functionCall"]
                tool_calls = [{
                    "id": f"call_{uuid.uuid4()}", "type": "function",
                    "function": {
                        "name": function_call["name"],
                        "arguments": json.dumps(function_call["args"]),
                    }
                }]
                message = {"role": "assistant", "content": None, "tool_calls": tool_calls}
            else:
                content = part.get("text", "")
                message = {"role": "assistant", "content": content}

            finish_reason = "tool_calls" if "tool_calls" in message else "stop"
            openai_response = {
                "id": f"chatcmpl-{uuid.uuid4()}", "object": "chat.completion",
                "created": int(time.time()), "model": model_name,
                "choices": [{"index": 0, "message": message, "finish_reason": finish_reason}],
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            }
            return Response(content=json.dumps(openai_response), media_type="application/json")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error desde la API de Gemini: {e.response.text}")
        except (KeyError, IndexError):
            raise HTTPException(status_code=500, detail=f"Error al procesar la respuesta de Gemini. Estructura inesperada: {gemini_data}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ocurrió un error interno: {str(e)}")

# --- Función Auxiliar ---
def _get_api_key(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Falta el encabezado de autorización o es inválido. Usa 'Authorization: Bearer TU_API_KEY'.",
        )
    return authorization.split(" ")[1]

@app.get("/", tags=["Health"])
def read_root():
    return {"status": "ok"}

