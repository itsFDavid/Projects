let cinta = ["0", "1", "1", "0", "1", "1", "0", "0", "0", "0", "0", "0", "0"];
let posicion = 0;
let estado = "J";
let fin = false;
const celdas = document.getElementsByClassName("celda");
const transiciones = {
    "A0": ["A", "0", "R"],
    "A1": ["B", "0", "R"],
    "B0": ["C", "0", "R"],
    "B1": ["B", "1", "R"],
    "C0": ["D", "1", "L"],
    "C1": ["C", "1", "R"],
    "D0": ["E", "0", "L"],
    "D1": ["D", "1", "L"],
    "E0": ["H", "1", "L"],
    "E1": ["F", "1", "L"],
    "F0": ["G", "1", "R"],
    "F1": ["F", "1", "L"],
    "H1": ["I", "1", "R"],
    "I0": ["L", "0", "L"],
    "I1": ["I", "1", "L"],
    "J0": ["J", "0", "R"],
    "J1": ["K", "0", "R"],
    "K0": ["A", "0", "R"],
    "K1": ["K", "1", "R"],
    "L0": ["O", "1", "L"],
    "L1": ["M", "1", "L"],
    "M0": ["N", "1", "R"],
    "M1": ["M", "1", "L"],
    "N1": ["K", "0", "R"],
    "O0": ["@", "0", "S"],
    "O1": ["O", "1", "L"],
    "G0": ["A", "0", "S"],
    "G1": ["A", "1", "S"]
};

const estados = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "@"];
const gradosEstados = {
    "A": -90, "B": -112.5, "C": -135, "D": -157.5, "E": -180,
    "F": -202.5, "G": -225, "H": -247.5, "I": -270, "J": -292.5,
    "K": -315, "L": -337.5, "M": -360, "N": -382.5, "O": -405, "@": -427.5
};

function renderizarCinta() {
    const cintaDiv = document.getElementById("cinta");
    cintaDiv.innerHTML = "";
    cinta.forEach((simbolo, index) => {
        const celda = document.createElement("div");
        celda.className = "celda";
        celda.textContent = simbolo;
        if (index === posicion) {
            celda.classList.add("activo");
        }
        cintaDiv.appendChild(celda);
    });
    document.getElementById("estado").textContent = estado;
}

function iniciarConCinta() {
    const cintaInput = document.getElementById("cintaInput").value;
    if (!/^[01]+$/.test(cintaInput)) {
        alert("La cinta solo debe contener 0s y 1s");
        return;
    }
    cinta = cintaInput.split("");
    posicion = 0;
    estado = "J";
    fin = false;
    renderizarCinta();
    rotarCicloEstado(estado);
}

function paso() {
    if (fin) return;
    const simbolo_actual = cinta[posicion];
    const clave = estado + simbolo_actual;

    if (!transiciones[clave]) {
        fin = true;
        renderizarCinta();
        
        Array.from(celdas).forEach(celda => celda.classList.add("fin"));
        return;
    }

    const [nuevo_estado, nuevo_simbolo, direccion] = transiciones[clave];
    cinta[posicion] = nuevo_simbolo;
    estado = nuevo_estado;

    if (direccion === "R") {
        posicion = (posicion + 1) % cinta.length;
    } else if (direccion === "L") {
        posicion = (posicion - 1 + cinta.length) % cinta.length;
    }

    renderizarCinta();
    rotarCicloEstado(estado);
}

function reset() {
    cinta = ["0", "1", "1", "0", "1", "1", "0", "0", "0", "0", "0", "0", "0"];
    posicion = 0;
    estado = "J";
    fin = false;
    renderizarCinta();
    rotarCicloEstado(estado);
}

function rotarCicloEstado(estadoActual) {
    const angulo = gradosEstados[estadoActual];
    document.getElementById("circuloEstados").style.transform = `rotate(${angulo}deg)`;
}

renderizarCinta();
rotarCicloEstado(estado);