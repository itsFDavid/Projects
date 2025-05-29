import argparse
from bs4 import BeautifulSoup

def extraer_datos_examen(html_content, nombre_examen="Examen Desconocido"):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    examen = {
        "nombre_examen": nombre_examen,
        "preguntas": []
    }
    
    # Extraer el título del examen si está disponible
    titulo_examen = soup.find('h2')
    if titulo_examen:
        examen["nombre_examen"] = titulo_examen.text.strip()
    
    # Extraer las preguntas
    preguntas = soup.find_all('li', class_='question-card')
    for pregunta in preguntas:
        pregunta_data = {
            "texto_pregunta": "",
            "opciones": []
        }
        
        # Extraer el texto de la pregunta
        texto_pregunta = pregunta.find('label')
        if texto_pregunta:
            pregunta_data["texto_pregunta"] = texto_pregunta.text.strip()
        
        # Extraer las opciones de respuesta
        opciones = pregunta.find_all('mat-radio-button') or pregunta.find_all('mat-checkbox')
        for opcion in opciones:
            texto_opcion = opcion.find('span', class_='mat-radio-label-content') or opcion.find('span', class_='mat-checkbox-label')
            if texto_opcion:
                pregunta_data["opciones"].append(texto_opcion.text.strip())
        
        examen["preguntas"].append(pregunta_data)
    
    return examen

def main():
    # Configurar el parser de argumentos
    parser = argparse.ArgumentParser(description="Extrae datos de un examen desde un archivo HTML.")
    parser.add_argument('--html', type=str, required=True, help="Ruta al archivo HTML que contiene el examen.")
    args = parser.parse_args()

    # Leer el contenido del archivo HTML
    with open(args.html, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Extraer los datos del examen
    datos_examen = extraer_datos_examen(html_content)

    # Imprimir los datos extraídos
    print(datos_examen)

if __name__ == "__main__":
    main()