const readline = require('readline');

// Configurar readline para leer desde la terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let meta = process.stdout.columns - 30;

class Bus {
    constructor(name) {
        this.name = name;
        this.posicion = 0;
    }

    avanzar() {
        this.posicion += Math.random() < 0.65 ? 1 : -1;
        if (this.posicion < 0) this.posicion = 0;
    }

    async dibujar() {
        const anchoConsola = process.stdout.columns - 10;
        const linea = '-'.repeat(anchoConsola);

        console.log(linea);

       
        console.log(`${" ".repeat(this.posicion)}       ______________`);
        console.log(`${" ".repeat(this.posicion)} - - | [][][][][] ||_|`);
        console.log(`${" ".repeat(this.posicion)} - - |   ${this.name}  )   } `);
        console.log(`${" ".repeat(this.posicion)}     dwb=-OO-----OO-=`);

        console.log(linea);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function main(buses) {
    let ganador = null;

    while (!ganador) {
        console.clear();
        for (const bus of buses) {
            bus.avanzar();
            await bus.dibujar();
            
            
            if (bus.posicion >= meta) {
                ganador = bus.name;
                break;
            }
        }  
        console.log("\n".repeat(3));
    }
    console.log(`¡El bus de ${ganador} ha ganado la carrera!`);
}

let Buses=[]
function addBus(name){
    Buses.push(new Bus(name));
}


function preguntarNombreBus() {
    rl.question('Ingresa el nombre del bus (o deja vacío para iniciar la carrera): ', (name) => {
        if (name) {
            addBus(name);  
            preguntarNombreBus();  
        } else {
            rl.close();
            main(Buses);
        }
    });
}

preguntarNombreBus();
