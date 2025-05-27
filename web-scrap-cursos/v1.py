from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time

# Configuración del driver de Selenium para Brave
options = webdriver.ChromeOptions()
options.binary_location = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Iniciar el navegador con WebDriver
service = Service('/usr/local/bin/chromedriver/chromedriver')
driver = webdriver.Chrome(service=service, options=options)

# URL de la página
url = "https://capacitateparaelempleo.org/cursos/view/174"
driver.get(url)

# Esperar a que la página cargue
wait = WebDriverWait(driver, 10)

# Expandir la sección mat-expansion-panel
try:
    expansion_panels = wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, "mat-expansion-panel")))
    for panel in expansion_panels:
        driver.execute_script("arguments[0].scrollIntoView();", panel)
        time.sleep(1)  # Pequeña espera para evitar errores
        panel.click()  # Hacer clic en cada panel para expandirlo
        time.sleep(1)  # Esperar a que se expanda
except Exception as e:
    print(f"Error al expandir paneles: {e}")

# Buscar el botón dentro de mat-card y hacer clic
try:
    button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "mat-card div button")))
    driver.execute_script("arguments[0].scrollIntoView();", button)
    time.sleep(1)
    button.click()
    time.sleep(2)  # Esperar a que el formulario se cargue
except Exception as e:
    print(f"Error al hacer clic en el botón: {e}")

# Esperar a que aparezca el formulario en mat-drawer-content
try:
    form_section = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "app-crear-examen section div div form")))
    html = driver.page_source  # Obtener HTML después de la interacción
except Exception as e:
    print(f"Error al encontrar el formulario: {e}")
    driver.quit()
    exit()

# Cerrar Selenium
driver.quit()

# Procesar el HTML con BeautifulSoup
soup = BeautifulSoup(html, "html.parser")

# Diccionario para almacenar los datos extraídos
data = {}

# Extraer información de las listas en el formulario
for li in soup.find_all("li"):
    label_tag = li.find("label")
    div_tag = li.find("div")

    if label_tag and div_tag:
        label_text = label_tag.text.strip()
        math_radio_group = div_tag.find("math-radio-group")

        if math_radio_group:
            span_tag = math_radio_group.find("span", class_="ng-star-inserted")
            value = span_tag.text.strip() if span_tag else "No encontrado"
            data[label_text] = value

# Mostrar los resultados
print(data)
