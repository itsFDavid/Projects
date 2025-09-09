# main.py
import httpx
import time
import uuid
import json  # Importar json para manejar la respuesta
from fastapi import FastAPI, HTTPException, Header, Response
from pydantic import BaseModel
from typing import List, Annotated

# --- Modelos de Datos (para validación) ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]

# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI(
    title="Gemini API Connector",
    description="Adapta la API de Gemini para que sea compatible con el formato de OpenRouter/OpenAI.",
    version="1.1.0",
)

# --- Endpoints de la API ---

@app.get("/v1/models", tags=["Models"])
@app.get("/models", tags=["Models"], include_in_schema=False)
async def get_models(authorization: Annotated[str | None, Header()] = None):
    """
    Obtiene los modelos de Gemini y los devuelve en el formato esperado por OpenRouter.
    """
    api_key = _get_api_key(authorization)
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(target_url)
            response.raise_for_status()
            gemini_data = response.json()
            
            # --- SECCIÓN DE TRANSFORMACIÓN ACTUALIZADA ---
            openrouter_formatted_models = []
            for model in gemini_data.get("models", []):
                # Incluir solo modelos que pueden generar contenido de texto
                if "generateContent" in model.get("supportedGenerationMethods", []):
                    model_id = model.get("name").replace("models/", "")
                    
                    openrouter_formatted_models.append({
                        "id": model_id,
                        "name": model.get("displayName", model_id), # Usar displayName si está disponible
                        "description": model.get("description", ""),
                        "pricing": { # Precios de ejemplo, ya que Gemini no los provee aquí
                            "prompt": "0.0",
                            "completion": "0.0",
                            "request": "0.0",
                            "image": "0.0"
                        },
                        "context_length": model.get("inputTokenLimit", 8192), # Usar el límite real si está disponible
                        "architecture": {
                            "modality": "text",
                            "tokenizer": "Google",
                            "instruct_type": "text"
                        },
                        "top_provider": {
                            "max_temperature": model.get("temperature", 1.0),
                            "is_moderated": False
                        },
                        "per_request_limits": None,
                        "created_at": int(time.time()) # Simular fecha de creación
                    })
            
            # La respuesta final solo contiene la clave "data"
            final_response = {"data": openrouter_formatted_models}
            
            # Usar json.dumps para serializar correctamente y devolver como Response
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
    
    last_user_prompt = next((msg.content for msg in reversed(request.messages) if msg.role == "user"), None)
    if not last_user_prompt:
        raise HTTPException(status_code=400, detail="No se encontró un mensaje de rol 'user'.")

    gemini_payload = {"contents": [{"parts": [{"text": last_user_prompt}]}]}
    
    model_name = request.model
    # Importante: el ID del modelo que recibimos es "gemini-pro", pero la API de Google espera "models/gemini-pro"
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(target_url, json=gemini_payload)
            response.raise_for_status()
            gemini_data = response.json()
            
            content = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
            
            openai_response = {
                "id": f"chatcmpl-{uuid.uuid4()}",
                "object": "chat.completion",
                "created": int(time.time()),
                "model": model_name,
                "choices": [{
                    "index": 0,
                    "message": { "role": "assistant", "content": content },
                    "finish_reason": "stop"
                }],
                "usage": { "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0 }
            }
            return Response(content=json.dumps(openai_response), media_type="application/json")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error desde la API de Gemini: {e.response.text}")
        except (KeyError, IndexError):
            raise HTTPException(status_code=500, detail=f"Error al procesar la respuesta de Gemini. Estructura inesperada. {gemini_data}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ocurrió un error interno: {str(e)}")

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
