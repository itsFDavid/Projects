# Usar una imagen base de Python ligera (Perfecto)
FROM python:3.11-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Crear el usuario sin privilegios ANTES de copiar los archivos.
# -m crea el directorio home, -s /bin/false es más seguro ya que no permite un shell de login.
RUN useradd -m -s /bin/false conector

# Copiar el archivo de requerimientos e instalarlos como root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código de la aplicación.
# OPTIMIZACIÓN: Usar --chown para copiar los archivos ya con el propietario correcto.
# Esto es más eficiente que hacer un `COPY` y luego un `RUN chown` por separado.
COPY --chown=conector:conector . .

# Ahora que todos los archivos están en su sitio y con los permisos correctos,
# cambiamos al usuario sin privilegios.
USER conector

# Exponer un puerto NO PRIVILEGIADO (mayor a 1024). El estándar es 8000.
EXPOSE 8000

# Comando para iniciar la aplicación en el puerto correcto.
# Dokploy se encargará de mapear el puerto 80 externo al 8000 interno.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
