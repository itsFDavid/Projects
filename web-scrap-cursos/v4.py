import argparse
import os
import pandas as pd
from bs4 import BeautifulSoup

def extraer_datos_examen(html_content, nombre_examen="Examen analizado"):
    soup = BeautifulSoup(html_content, 'html.parser')
    # put timestamp in the name of the exam
    examen = {
        "nombre_examen": nombre_examen+" - "+ str(pd.Timestamp.now()),
        "preguntas": []
    }

    # # Extraer el título del examen si está disponible
    # titulo_examen = soup.find('h2')
    # if titulo_examen:
    #     examen["nombre_examen"] = titulo_examen.text.strip()

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

def guardar_examen_como_csv(examen, nombre):
    # Crear la carpeta "examenes" si no existe
    if not os.path.exists("examenes"):
        os.makedirs("examenes")

    # Crear un DataFrame a partir de los datos del examen
    preguntas = examen["preguntas"]
    data = []

    # Determinar el número máximo de opciones en todas las preguntas
    max_opciones = max(len(pregunta["opciones"]) for pregunta in preguntas)

    # Crear las columnas dinámicamente
    columnas = ["Pregunta"] + [f"Opción {i+1}" for i in range(max_opciones)]

    for pregunta in preguntas:
        texto_pregunta = pregunta["texto_pregunta"]
        opciones = pregunta["opciones"]
        # Rellenar con None si hay menos opciones que el máximo
        opciones += [None] * (max_opciones - len(opciones))
        data.append([texto_pregunta] + opciones)

    # Crear el DataFrame
    df = pd.DataFrame(data, columns=columnas)

    # si ya existe un archivo con el nombre, se le agrega un numero al final
    nombre_archivo = f"examenes/{nombre}.json"
    if os.path.exists(nombre_archivo):
        i = 1
        while True:
            nombre_archivo = f"examenes/{nombre}_{i}.json"
            if not os.path.exists(nombre_archivo):
                break
            i += 1

    # Guardar el DataFrame en un archivo JSON con caracteres especiales
    df.to_json(nombre_archivo, orient='records', force_ascii=False, indent=4)

    print(f"Examen guardado en: {nombre_archivo}")

def main():
    # Configurar el parser de argumentos
    parser = argparse.ArgumentParser(description="Extrae datos de un examen desde un archivo HTML y los guarda en un archivo CSV.")
    parser.add_argument('--html', type=str, required=True, help="Ruta al archivo HTML que contiene el examen.")
    args = parser.parse_args()
    # get name of the argument
    nombre = args.html
    nombre = nombre.split(".")[0]

    # Leer el contenido del archivo HTML
    with open(args.html, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Extraer los datos del examen
    datos_examen = extraer_datos_examen(html_content)

    # Guardar los datos del examen en un archivo CSV
    guardar_examen_como_csv(datos_examen, nombre)

if __name__ == "__main__":
    main()
