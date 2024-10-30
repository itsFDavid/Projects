let cinta = ["0", "1", "1", "0", "1", "1", "0", "0", "0", "0", "0", "0", "0"];
let cintaDada = [];
let posicion = 0;
let estado = "J";
const estados = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "@"];
let fin = false;
const gradosEstados = {
    "A": -90,
    "B": -112.5,
    "C": -135,
    "D": -157.5,
    "E": -180,
    "F": -202.5,
    "G": -225,
    "H": -247.5,
    "I": -270,
    "J": -292.5,
    "K": -315,
    "L": -337.5,
    "M": -360,
    "N": -382.5,
    "O": -405,
    "@": -427.5
}
function renderizarCinta() {
    const cintaDiv = document.getElementById("cinta");
    cintaDiv.innerHTML = "";
    const cint = cintaDada.length > 0 ? cintaDada : cinta;
    cint.forEach((simbolo, index) => {
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

async function iniciarConCinta() {
    const cintaInput = document.getElementById("cintaInput").value;
    const response = await fetch('http://127.0.0.1:4000/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cinta: cintaInput })
    });
    const data = await response.json();
    cintaDada = data.cinta;
    posicion = data.posicion;
    estado = data.estado;
    renderizarCinta();
    rotarCicloEstado(estado);
}

async function paso() {
    const response = await fetch('http://127.0.0.1:4000/paso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cinta, posicion, estado })
    });
    const data = await response.json();

    if (data.fin) {
        document.querySelectorAll(".celda").forEach((celda) => {
            celda.classList.add("fin");
        });
        return;
    }


    cintaDada = data.cinta;
    cinta = data.cinta;
    posicion = data.posicion;
    estado = data.estado;
    fin = data.fin;
    console.log(data);
    rotarCicloEstado(estado);
    renderizarCinta();
}

function reset() {
    fetch("http://127.0.0.1:4000/reset",)
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll(".celda").forEach((celda) => {
                celda.classList.remove("fin");
            });
            cinta = data.cinta;
            posicion = data.posicion;
            estado = data.estado;
            renderizarCinta();
            rotarCicloEstado(estado);
        });
}

function rotarCicloEstado(estadoActual) {
    const indice = estados.indexOf(estadoActual);
    if (indice >= 0) {
        const angulo = gradosEstados[estadoActual];
        document.getElementById("circuloEstados").style.transform = `rotate(${angulo}deg)`;
    }
}
renderizarCinta();
rotarCicloEstado(estado);