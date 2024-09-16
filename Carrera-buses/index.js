let meta = process.stdout.columns - 25;

class Bus {
    constructor(name, carril) {
        this.name = name;
        this.posicion = 0;
        this.carril = carril;  // Carril donde se dibuja el bus
    }

    avanzar() {
        this.posicion += Math.random() < 0.65 ? 1 : -1;
        if (this.posicion < 0) this.posicion = 0;
    }

    async dibujar() {
        const anchoConsola = process.stdout.columns;
        const linea = '-'.repeat(anchoConsola);

        // Dibujar la carretera
        console.log(linea);

       
        console.log(`${" ".repeat(this.posicion)}       ______________`);
        console.log(`${" ".repeat(this.posicion)} - - | [][][][][] ||_|`);
        console.log(`${" ".repeat(this.posicion)} - - |   ${this.name}  )   } `);
        console.log(`${" ".repeat(this.posicion)}     dwb=-OO-----OO-=`);

        // Dibujar la separación entre carriles (carretera)
        console.log(linea);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

let bus1 = new Bus("Francisco", 1);  // Carril 1
let bus2 = new Bus("David", 2);      // Carril 2
let buses = [bus1, bus2];
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
    }
    console.log(`¡El bus de ${ganador} ha ganado la carrera!`);
}

main(buses);
