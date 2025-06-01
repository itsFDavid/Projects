import argparse
import os
import pandas as pd
from bs4 import BeautifulSoup

def limpiar_texto(texto):
    """
    Función para eliminar saltos de línea y espacios innecesarios del texto.
    """
    if texto:
        # Eliminar saltos de línea y espacios adicionales
        return texto.replace('\n', ' ').strip()
    return texto

def extraer_datos_examen(html_content, nombre_examen="Examen analizado"):
    soup = BeautifulSoup(html_content, 'html.parser')
    # Agregar timestamp al nombre del examen
    examen = {
        "nombre_examen": nombre_examen + " - " + str(pd.Timestamp.now()),
        "preguntas": []
    }

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
            pregunta_data["texto_pregunta"] = limpiar_texto(texto_pregunta.text)

        # Extraer las opciones de respuesta (primero intenta con mat-radio-button o mat-checkbox)
        opciones = pregunta.find_all('mat-radio-button') or pregunta.find_all('mat-checkbox')
        if opciones:
            for opcion in opciones:
                texto_opcion = opcion.find('span', class_='mat-radio-label-content') or opcion.find('span', class_='mat-checkbox-label')
                if texto_opcion:
                    pregunta_data["opciones"].append(limpiar_texto(texto_opcion.text))
        else:
            # Si no hay opciones en mat-radio-button o mat-checkbox, busca en los bloques cdk-drag
            bloques_cdk_drag = pregunta.find_all('div', class_='cdk-drag')
            for bloque in bloques_cdk_drag:
                texto_opcion = bloque.find('span')
                if texto_opcion:
                    pregunta_data["opciones"].append(limpiar_texto(texto_opcion.text))

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

    # Si ya existe un archivo con el nombre, se le agrega un número al final
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
    parser = argparse.ArgumentParser(description="Extrae datos de un examen desde un archivo HTML y los guarda en un archivo JSON.")
    parser.add_argument('--html', type=str, required=True, help="Ruta al archivo HTML que contiene el examen.")
    args = parser.parse_args()
    # Obtener el nombre del archivo sin extensión
    nombre = args.html.split(".")[0]

    # Leer el contenido del archivo HTML
    with open(args.html, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Extraer los datos del examen
    datos_examen = extraer_datos_examen(html_content)

    # Guardar los datos del examen en un archivo JSON
    guardar_examen_como_csv(datos_examen, nombre)

if __name__ == "__main__":
    main()