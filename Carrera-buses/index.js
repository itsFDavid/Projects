import chalk from 'chalk';
import readline from 'readline';
// Configurar readline para leer desde la terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let meta = process.stdout.columns - 30;
let Buses=[]
let carrilInicial = 0;
const COLORS = [
    "red",
    "green",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray"
]

class Bus {
    constructor(name, color,carril) {
        this.name = name;
        this.posicion = 0;
        this.color = color;
        this.carril = carril;
    }

    avanzar() {
        this.posicion += Math.random() < 0.85 ? 1 : -1;
        if (this.posicion < 0) this.posicion = 0;
    }

    async dibujar() {
        const anchoConsola = process.stdout.columns - 10;
        const linea = '-'.repeat(anchoConsola);

        console.log("\n".repeat(this.carril));

        console.log(chalk.yellow(linea));
        const colorFunc = chalk[this.color] || chalk.white;
        console.log(colorFunc(`${" ".repeat(this.posicion)}       ______________`));
        console.log(colorFunc(`${" ".repeat(this.posicion)} - - | [][][][][] ||_|`));
        console.log(colorFunc(`${" ".repeat(this.posicion)} - - |   ${this.name}  )   } `));
        console.log(colorFunc(`${" ".repeat(this.posicion)}     dwb=-OO-----OO-=`));

        console.log(chalk.yellow(linea));
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}
function limpiarConsola() {
    process.stdout.write('\x1Bc');
}

async function main(buses) {
    let ganador = null;
    if (buses.length === 0) {
        console.log('No hay buses para correr');
        return;
    }

    while (!ganador) {
        
        for (const bus of buses) {
            bus.avanzar();
            console.clear();
            await bus.dibujar();
            
            
            if (bus.posicion >= meta) {
                ganador = bus.name;
                break;
            }
        }  
    }
    console.log(chalk.bgYellowBright(`¡El bus de ${ganador} ha ganado la carrera!`));
}


function addBus(name, color){
    Buses.push(new Bus(name, color, carrilInicial));
    carrilInicial += 6;
}


function preguntarNombreBus() {
    limpiarConsola();
    rl.question(chalk.red('Ingresa el nombre del bus ' + chalk.gray('(o deja vacío para iniciar la carrera): ')), (name) => {
        if(!name){
            rl.close();
            main(Buses);
        }else{
            COLORS.forEach((color, index) => {
                console.log(index + 1, chalk[color](color));
            });
            rl.question(chalk.red('Ingresa el color del bus: '), (color) => {
                if(!color) color = 'green';
                addBus(name,color);
                console.clear();
                preguntarNombreBus();
            });
        }
    });
}

preguntarNombreBus();