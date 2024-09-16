let meta = process.stdout.columns - 25;

class Bus {
    constructor(name) {
        this.name = name;
        this.posicion = 0;
    }

    avanzar() {
        this.posicion += Math.random() < 0.65 ? 1 : -1;
        if (this.posicion < 0) this.posicion = 0;
    }
    async dibujar(){
        const anchoConsola = process.stdout.columns - 25;
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

let bus1 = new Bus("Francisco");
let bus2 = new Bus("David");



async function main( buses) {
    buses.map(bus => {
        while (bus.posicion < meta) {
            bus.avanzar();
            bus.avanzar();
            console.clear();
            await bus.dibujar();
            
        }
    });
    
    if (bus1.posicion >= meta) {
        console.log("El bus de Francisco ha ganado");
    } else {
        console.log("El bus de David ha ganado");
    }
}
let buses = [bus1, bus2];


