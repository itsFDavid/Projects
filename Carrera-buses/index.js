import chalk from 'chalk';
import readline from 'readline';
import player from 'play-sound';
import inquirer from 'inquirer';
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
        this.posicion += Math.random() < 0.65 ? 1 : -.05;
        if (this.posicion < 0) this.posicion = 0;
    }

    async dibujar() {
        const anchoConsola = process.stdout.columns - 10;
        const linea = '-'.repeat(anchoConsola);

        console.log("\n".repeat(this.carril));

        console.log(chalk.bgGray(linea));
        const colorFunc = chalk[this.color] || chalk.white;
        console.log(colorFunc(`${" ".repeat(this.posicion)}       ______________`));
        console.log(colorFunc(`${" ".repeat(this.posicion)} - - | [][][][][] ||_|`));
        console.log(colorFunc(`${" ".repeat(this.posicion)} - - |   ${this.name}  )   } `));
        console.log(colorFunc(`${" ".repeat(this.posicion)}     dwb=-OO-----OO-=`));

        console.log(chalk.bgGray(linea));
        await new Promise(resolve => setTimeout(resolve, 40));
    }
    async velocidad(){
        const velocidad= parseInt(this.posicion);
        console.log("\n".repeat(this.carril));
        console.log(chalk.bgBlueBright(`Bus de ${this.name} va a :\t${velocidad}Km/h`));
        await new Promise(resolve => setTimeout(resolve, 30));
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
    var audio = player().play('carrera_de_buses.m4r', (err) => {
        if (err) console.error('Error al reproducir el audio:', err);
    });
    while (!ganador) {
        for (const bus of buses) {
            bus.avanzar();
            console.clear();
            bus.velocidad();
            await bus.dibujar();
            
            
            
            if (bus.posicion >= meta) {
                ganador = bus;
                audio.kill();
                break;
            }
        }  
    }
    console.log(chalk.bgGreenBright(`El bus ${ganador.name} ha ganado la carrera`));
}


function addBus(name, color){
    Buses.push(new Bus(name, color, carrilInicial));
    carrilInicial += 6;
}


async function preguntarNombreBus() {
    limpiarConsola();
    while (true) {
        const { nombre } = await inquirer.prompt({
            type: 'input',
            name: 'nombre',
            message: chalk.yellow('Ingresa el nombre del bus ') + chalk.gray('(o deja vacío para iniciar la carrera):')
        });

        if (!nombre) break;

        const { color } = await inquirer.prompt({
            type: 'list',
            name: 'color',
            message: chalk.green('Selecciona el color del bus:'),
            choices: COLORS.map(color => ({
                name: chalk[color](color),
                value: color
            }))
        });
        addBus(nombre, color);
    }
    main(Buses);
}

preguntarNombreBus();
