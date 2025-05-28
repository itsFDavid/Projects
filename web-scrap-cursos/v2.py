from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import time

# Configurar Selenium con el driver de Chrome
service = Service("chromedriver")  # Asegúrate de tener el chromedriver en la misma carpeta
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Ejecutar en segundo plano (quítalo si quieres ver el navegador)

driver = webdriver.Chrome(service=service, options=options)

# 🔹 1. Ir a la página de inicio de sesión
login_url = "https://tu-pagina.com/login"  # Reemplaza con la URL real
driver.get(login_url)
time.sleep(2)  # Esperar a que cargue la página

# 🔹 2. Ingresar usuario y contraseña
username_input = driver.find_element(By.NAME, "username")  # Reemplaza con el selector real
password_input = driver.find_element(By.NAME, "password")  # Reemplaza con el selector real

username_input.send_keys("TU_USUARIO")  # Reemplaza con tu usuario
password_input.send_keys("TU_CONTRASEÑA")  # Reemplaza con tu contraseña
password_input.send_keys(Keys.RETURN)  # Presionar Enter

time.sleep(3)  # Esperar a que se redirija después del login

# 🔹 3. Ir a la página donde están los datos
data_url = "https://tu-pagina.com/datos"  # Reemplaza con la URL real después del login
driver.get(data_url)
time.sleep(3)

# Obtener HTML después del login
html = driver.page_source
driver.quit()  # Cerrar el navegador

# 🔹 4. Procesar el HTML con BeautifulSoup
soup = BeautifulSoup(html, "html.parser")

# 🔹 5. Encontrar el formulario y el `<ul>` dentro
form = soup.find("form")
if not form:
    print("No se encontró el formulario")
    exit()

ul = form.find("ul")
if not ul:
    print("No se encontró la lista dentro del formulario")
    exit()

# 🔹 6. Extraer datos de cada `<li>`
data = {}

for li in ul.find_all("li"):
    label_tag = li.find("label")  # Obtener el label dentro de `li`
    div_tag = li.find("div")  # Buscar el div que contiene `math-radio-group`

    if label_tag and div_tag:
        label_text = label_tag.text.strip()  # Extraer el texto del label
        values = []  # Lista para almacenar los valores de este `li`

        # Buscar todos los spans dentro del `div`
        span_tags = div_tag.find_all("span", class_="ng-star-inserted")

        for span in span_tags:
            values.append(span.text.strip())  # Agregar el valor encontrado

        # Guardar en el diccionario con clave `label_text`
        data[label_text] = values

# 🔹 7. Mostrar resultados
print(data)
