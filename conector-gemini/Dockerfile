# Usar una imagen base de Python ligera
FROM python:3.11-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo de requerimientos e instalarlos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código de la aplicación
COPY . .

# Usar otro usuario
RUN useradd -m conector
USER conector

# Establecer permisos para el directorio de trabajo
RUN chown -R conector:conector /app

# Exponer el puerto en el que correrá la aplicación
EXPOSE 80

# Comando para iniciar la aplicación cuando el contenedor se inicie
# Uvicorn es el servidor que correrá nuestro código FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]