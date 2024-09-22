import inquirer from "inquirer";
import chalk from "chalk";
class arbolBinario{

    constructor(){
        this.raiz = null;
        this.left = null;
        this.right = null;
    }

    insertar(valor){
        if(this.raiz == null){
            this.raiz = new Nodo(valor);
        }else{
            this.insertarNodo(this.raiz, valor);
        }
    }

    insertarNodo(nodo, valor){
        if(valor < nodo.valor){
            if(nodo.left == null){
                nodo.left = new Nodo(valor);
            }else{
                this.insertarNodo(nodo.left, valor);
            }
        }else if(valor > nodo.valor){
            if(nodo.right == null){
                nodo.right = new Nodo(valor);
            }else{
                this.insertarNodo(nodo.right, valor);
            }
        }
    }

    buscar(valor){
        return this.buscarNodo(this.raiz, valor);
    }

    buscarNodo(nodo, valor){
        if(nodo == null){
            return null;
        }else if(valor < nodo.valor){
            return this.buscarNodo(nodo.left, valor);
        }else if(valor > nodo.valor){
            return this.buscarNodo(nodo.right, valor);
        }else{
            return nodo;
        }
    }

    eliminar(valor){
        this.raiz = this.eliminarNodo(this.raiz, valor);
    }

    eliminarNodo(nodo, valor){
        if(nodo == null){
            return null;
        }else if(valor < nodo.valor){
            nodo.left = this.eliminarNodo(nodo.left, valor);
            return nodo;
        }else if(valor > nodo.valor){
            nodo.right = this.eliminarNodo(nodo.right, valor);
            return nodo;
        }else{
            if(nodo.left == null && nodo.right == null){
                nodo = null;
                return nodo;
            }
            if(nodo.left == null){
                nodo = nodo.right;
                return nodo;
            }else if(nodo.right == null){
                nodo = nodo.left;
                return nodo;
            }
            var aux = this.minimo(nodo.right);
            nodo.valor = aux.valor;
            nodo.right = this.eliminarNodo(nodo.right, aux.valor);
            return nodo;
        }
    }


    minimo(nodo){
        if(nodo == null){
            return null;
        }else if(nodo.left == null){
            return nodo;
        }else{
            return this.minimo(nodo.left);
        }
    }

    preOrden(nodo){
        if(nodo != null){
            console.log(nodo.valor);
            this.preOrden(nodo.left);
            this.preOrden(nodo.right);
        }
    }

    inOrden(nodo){
        if(nodo != null){
            this.inOrden(nodo.left);
            console.log(nodo.valor);
            this.inOrden(nodo.right);
        }
    }

    postOrden(nodo){
        if(nodo != null){
            this.postOrden(nodo.left);
            this.postOrden(nodo.right);
            console.log(nodo.valor);
        }
    }

    getRaiz(){
        return this.raiz;
    }
}

class Nodo{
    constructor(valor){
        this.valor = valor;
        this.left = null;
        this.right = null;
    }

    getValor(){
        return this.valor;
    }

    getLeft(){
        return this.left;
    }

    getRight(){
        return this.right;
    }

    setValor(valor){
        this.valor = valor;
    }

    setLeft(left){
        this.left = left;
    }

    setRight(right){
        this.right = right;
    }
}

const main = async () => {
    const {arbol} = await inquirer.prompt({
        type: 'input',
        name: 'arbol',
        message: chalk.bgCyan('Ingrese el valor del nodo a insertar')
    });
    const arb= new arbolBinario();
    while (arbol){
        const {opcion} = await inquirer.prompt({
            type: 'list',
            name: 'opcion',
            message: chalk.bgCyan('Seleccione una opcion'),
            choices: ['Insertar', 'Buscar', 'Eliminar', 'PreOrden', 'InOrden', 'PostOrden', 'Salir']
        });

        switch(opcion){
            case 'Insertar':
                var valor = await inquirer.prompt({
                    type: 'input',
                    name: 'valor',
                    message: chalk.bgBlue('Ingrese el valor del nodo a insertar')
                });
                arb.insertar(valor);
                break;
            case 'Buscar':
                var valor = await inquirer.prompt({
                    type: 'input',
                    name: 'valor',
                    message: chalk.bgBlue('Ingrese el valor del nodo a insertar')
                });
                arb.buscar(valor);
                break;
            case 'Eliminar':
                var valor = await inquirer.prompt({
                    type: 'input',
                    name: 'valor',
                    message: chalk.bgBlue('Ingrese el valor del nodo a insertar')
                });
                arb.eliminar(valor);
                break;
            case 'PreOrden':
                arb.preOrden(arb.getRaiz());
                break;
            case 'InOrden':
                arb.inOrden(arb.getRaiz());
                break;
            case 'PostOrden':
                arb.postOrden(arb.getRaiz());
                break;
            case 'Salir':
                return;
        }
    }
}

main();