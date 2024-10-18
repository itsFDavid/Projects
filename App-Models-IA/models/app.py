from flask import Flask, request, jsonify
import jwt  
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from predict import prediccion
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
SECRET_KEY = os.getenv("SECRET_KEY")

@app.route('/email/predict', methods=['POST'])
def predict():
    """Endpoint para predecir la precisión del modelo."""
    # Obtener el token del encabezado de la solicitud
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        print('Token no proporcionado')
        return jsonify({'error': 'Token no proporcionado'}), 401

    # El token viene como 'Bearer <token>', así que lo separamos
    parts = auth_header.split()
    if parts[0].lower() != 'bearer' or len(parts) != 2:
        print('Formato de token incorrecto')
        return jsonify({'error': 'Formato de token incorrecto'}), 401

    token = parts[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except ExpiredSignatureError:
        print('El token ha expirado')
        return jsonify({'error': 'El token ha expirado'}), 401
    except InvalidTokenError as e:
        print(f'Token inválido: {str(e)}')
        return jsonify({'error': 'Token inválido'}), 401

    # Obtener los valores del cuerpo de la solicitud
    data = request.get_json()
    n_elements = data.get('n_elements')
    n_train = data.get('n_train')
    n_test = data.get('n_test')

    # Validar que todos los parámetros estén presentes
    if None in [n_elements, n_train, n_test]:
        return jsonify({'error': 'Faltan parámetros en la solicitud'}), 400

    # Validar que la suma de n_train y n_test sea igual a n_elements
    if n_train + n_test != n_elements:
        return jsonify({'error': 'La suma de n_train y n_test debe ser igual a n_elements'}), 400

    # Llamar a la función de predicción
    accuracy = prediccion(n_elements, n_train, n_test)

    # Devolver la respuesta
    return jsonify({'accuracy': accuracy})

# Ejecutar la app
if __name__ == '__main__':
    port = int(os.getenv("FLASK_RUN_PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 
