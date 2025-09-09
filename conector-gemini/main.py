# main.py
import os
import httpx
import time
import uuid
from fastapi import FastAPI, HTTPException, Header, Response
from pydantic import BaseModel, Field
from typing import List, Annotated

# --- Modelos de Datos (para validación y formato tipo OpenAI) ---

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
        # Ejemplo: "gemini-pro"
    messages: List[ChatMessage]
    # Se pueden añadir otros campos como temperature, max_tokens, etc. si los quieres implementar

# --- Inicialización de la Aplicación FastAPI ---

app = FastAPI(
    title="Gemini API Connector",
    description="Adapta la API de Gemini para que sea compatible con el formato de OpenAI.",
    version="1.0.0",
)

# --- Endpoints de la API ---

@app.get("/v1/models", tags=["Models"])
async def get_models(authorization: Annotated[str | None, Header()] = None):
    """
    Obtiene los modelos de Gemini usando la API Key del header 'Authorization: Bearer <key>'
    y los devuelve en un formato similar al de OpenAI.
    """
    api_key = _get_api_key(authorization)
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(target_url)
            response.raise_for_status()
            gemini_data = response.json()
            
            openai_formatted_models = []
            for model in gemini_data.get("models", []):
                if "generateContent" in model.get("supportedGenerationMethods", []):
                    openai_formatted_models.append({
                        "id": model.get("name").replace("models/", ""),
                        "object": "model",
                        "created": int(time.time()),
                        "owned_by": "google",
                    })

            final_response = {"object": "list", "data": openai_formatted_models}
            return Response(content=str(final_response), media_type="application/json")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error desde la API de Gemini: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ocurrió un error interno: {str(e)}")

@app.post("/v1/chat/completions", tags=["Chat"])
async def create_chat_completion(
    request: ChatCompletionRequest,
    authorization: Annotated[str | None, Header()] = None,
):
    """
    Recibe una solicitud tipo OpenAI, la traduce para Gemini y devuelve una respuesta tipo OpenAI.
    """
    api_key = _get_api_key(authorization)
    
    # 1. Traducir la solicitud de formato OpenAI a formato Gemini
    # Para simplificar, usamos el contenido del último mensaje como el prompt principal
    last_user_prompt = next((msg.content for msg in reversed(request.messages) if msg.role == "user"), None)
    if not last_user_prompt:
        raise HTTPException(status_code=400, detail="No se encontró un mensaje de rol 'user'.")

    gemini_payload = {
        "contents": [{"parts": [{"text": last_user_prompt}]}]
    }
    
    # 2. Realizar la llamada a la API de Gemini
    model_name = request.model
    target_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(target_url, json=gemini_payload)
            response.raise_for_status()
            gemini_data = response.json()
            
            # 3. Traducir la respuesta de Gemini a formato OpenAI
            # Extraer el texto de la respuesta de forma segura
            content = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
            
            openai_response = {
                "id": f"chatcmpl-{uuid.uuid4()}",
                "object": "chat.completion",
                "created": int(time.time()),
                "model": model_name,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": content,
                    },
                    "finish_reason": "stop"
                }],
                "usage": { # Nota: Gemini no provee el conteo de tokens, se simula
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0
                }
            }
            return Response(content=str(openai_response), media_type="application/json")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error desde la API de Gemini: {e.response.text}")
        except (KeyError, IndexError) as e:
            raise HTTPException(status_code=500, detail=f"Error al procesar la respuesta de Gemini. Estructura inesperada. {gemini_data}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ocurrió un error interno: {str(e)}")

def _get_api_key(authorization: str | None) -> str:
    """Función auxiliar para validar y extraer la API key del header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Falta el encabezado de autorización o es inválido. Usa 'Authorization: Bearer TU_API_KEY'.",
        )
    return authorization.split(" ")[1]

@app.get("/", tags=["Health"])
def read_root():
    return {"status": "ok"}