from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


cintaOriginal = ["0", "1", "1", "0", "1", "1", "0", "0", "0", "0", "0", "0", "0"]
cinta = list(cintaOriginal)
posicion = 0
estado = "J"


transiciones = {
    ("A", "0"): ("A", "0", "R"),
    ("A", "1"): ("B", "0", "R"),
    ("B", "0"): ("C", "0", "R"),
    ("B", "1"): ("B", "1", "R"),
    ("C", "0"): ("D", "1", "L"),
    ("C", "1"): ("C", "1", "R"),
    ("D", "0"): ("E", "0", "L"),
    ("D", "1"): ("D", "1", "L"),
    ("E", "0"): ("H", "1", "L"),
    ("E", "1"): ("F", "1", "L"),
    ("F", "0"): ("G", "1", "R"),
    ("F", "1"): ("F", "1", "L"),
    ("H", "1"): ("I", "1", "R"),
    ("I", "0"): ("L", "0", "L"),
    ("I", "1"): ("I", "1", "L"),
    ("J", "0"): ("J", "0", "R"),
    ("J", "1"): ("K", "0", "R"),
    ("K", "0"): ("A", "0", "R"),
    ("K", "1"): ("K", "1", "R"),
    ("L", "0"): ("O", "1", "L"),
    ("L", "1"): ("M", "1", "L"),
    ("M", "0"): ("N", "1", "R"),
    ("M", "1"): ("M", "1", "L"),
    ("N", "1"): ("K", "0", "R"),
    ("O", "0"): ("@", "0", "S"),
    ("O", "1"): ("O", "1", "L"),
    ("G", "0"): ("A", "0", "S"),
    ("G", "1"): ("A", "1", "S")
}

@app.route('/iniciar', methods=['POST'])
def iniciar():
    global cinta, posicion, estado
    data = request.json
    nueva_cinta = data.get("cinta", "")

    # Valida la cinta
    if not all(c in "01" for c in nueva_cinta):
        return jsonify({"error": "La cinta solo debe contener 0s y 1s"}), 400

    cinta = list(nueva_cinta)
    posicion = 0
    estado = "J"
    print("Cinta:", cinta)
    print("Posición:", posicion)
    print("Estado:", estado)
    return jsonify({"estado": estado, "cinta": cinta, "posicion": posicion})


@app.route('/paso', methods=['POST'])
def paso():
    global posicion, estado, cinta


    simbolo_actual = cinta[posicion]

    clave = (estado, simbolo_actual)
    if clave not in transiciones:
        return jsonify({"fin": True, "estado": estado, "cinta": cinta, "posicion": posicion})

    # Realiza la transición
    nuevo_estado, nuevo_simbolo, direccion = transiciones[clave]
    cinta[posicion] = nuevo_simbolo  # Escribe el nuevo símbolo
    estado = nuevo_estado  # Cambia al nuevo estado

    # Actualiza la posición del cabezal
    if direccion == "R":
        posicion += 1
    elif direccion == "L":
        posicion -= 1
    print("Cinta:", cinta)
    print("Posición:", posicion)
    print("Estado:", estado)
    return jsonify({"fin": False, "estado": estado, "cinta": cinta, "posicion": posicion})

@app.route("/reset", methods=['GET'])
def reset():
    global posicion, estado, cinta
    cinta = list(cintaOriginal)
    estado = "J"
    posicion = 0
    return jsonify({"Reinicio": True, "estado": estado, "cinta": cinta, "posicion": posicion})

if __name__ == "__main__":
    port = 4000
    app.run(host='0.0.0.0', port=port, debug=True)
