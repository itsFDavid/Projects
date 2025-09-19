import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet"; // Para darle un toque gráfico a los títulos

class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.left = null;
    this.right = null;
  }
}

class ArbolBinario {
  constructor() {
    this.raiz = null;
  }

  insertar(valor) {
    const nuevoNodo = new Nodo(valor);
    if (this.raiz === null) {
      this.raiz = nuevoNodo;
    } else {
      this.insertarNodo(this.raiz, nuevoNodo);
    }
  }

  insertarNodo(nodo, nuevoNodo) {
    if (nuevoNodo.valor < nodo.valor) {
      if (nodo.left === null) {
        nodo.left = nuevoNodo;
      } else {
        this.insertarNodo(nodo.left, nuevoNodo);
      }
    } else {
      if (nodo.right === null) {
        nodo.right = nuevoNodo;
      } else {
        this.insertarNodo(nodo.right, nuevoNodo);
      }
    }
  }

  buscar(valor) {
    return this.buscarNodo(this.raiz, valor);
  }

  buscarNodo(nodo, valor) {
    if (nodo === null) {
      return null;
    }
    if (valor < nodo.valor) {
      return this.buscarNodo(nodo.left, valor);
    } else if (valor > nodo.valor) {
      return this.buscarNodo(nodo.right, valor);
    } else {
      return nodo;
    }
  }

  eliminar(valor) {
    this.raiz = this.eliminarNodo(this.raiz, valor);
  }

  eliminarNodo(nodo, valor) {
    if (nodo === null) {
      return null;
    }
    if (valor < nodo.valor) {
      nodo.left = this.eliminarNodo(nodo.left, valor);
      return nodo;
    } else if (valor > nodo.valor) {
      nodo.right = this.eliminarNodo(nodo.right, valor);
      return nodo;
    } else {
      if (nodo.left === null && nodo.right === null) {
        return null;
      }
      if (nodo.left === null) {
        return nodo.right;
      }
      if (nodo.right === null) {
        return nodo.left;
      }
      const aux = this.minimo(nodo.right);
      nodo.valor = aux.valor;
      nodo.right = this.eliminarNodo(nodo.right, aux.valor);
      return nodo;
    }
  }

  minimo(nodo) {
    if (nodo.left === null) {
      return nodo;
    }
    return this.minimo(nodo.left);
  }

  preOrden(nodo) {
    if (nodo !== null) {
      console.log(nodo.valor);
      this.preOrden(nodo.left);
      this.preOrden(nodo.right);
    }
  }

  inOrden(nodo) {
    if (nodo !== null) {
      this.inOrden(nodo.left);
      console.log(nodo.valor);
      this.inOrden(nodo.right);
    }
  }

  postOrden(nodo) {
    if (nodo !== null) {
      this.postOrden(nodo.left);
      this.postOrden(nodo.right);
      console.log(nodo.valor);
    }
  }

  getRaiz() {
    return this.raiz;
  }

  imprimirArbol(nodo = this.raiz, prefijo = "", esIzquierdo = true) {
    if (nodo !== null) {
      // Llamada recursiva en el subárbol derecho primero (para que se imprima en la parte superior)
      this.imprimirArbol(
        nodo.right,
        prefijo + (esIzquierdo ? "│   " : "    "),
        false
      );

      // Imprimir el nodo actual
      console.log(
        chalk.red(prefijo + (esIzquierdo ? "└── " : "┌── ") + nodo.valor)
      );

      // Llamada recursiva en el subárbol izquierdo
      this.imprimirArbol(
        nodo.left,
        prefijo + (esIzquierdo ? "    " : "│   "),
        true
      );
    }
  }
}

const main = async () => {
  console.log(chalk.yellow(figlet.textSync("Arbol Binario")));
  const arbol = new ArbolBinario();

  let continuar = true;
  while (continuar) {
    // limpiar la consola
    console.clear();
    console.log(chalk.yellow(figlet.textSync("Arbol Binario")));
    arbol.imprimirArbol();
    console.log("\n");
    const { opcion } = await inquirer.prompt({
      type: "list",
      name: "opcion",
      message: chalk.green("Seleccione una opción"),
      choices: [
        "[1] Insertar",
        "[2] Buscar",
        "[3] Eliminar",
        "[4] PreOrden",
        "[5] InOrden",
        "[6] PostOrden",
        "[7] Imprimir Árbol",
        "[8] Salir",
      ],
    });

    switch (opcion) {
      case "[1] Insertar":
        const { valorInsertar } = await inquirer.prompt({
          type: "input",
          name: "valorInsertar",
          message: chalk.blue("Ingrese el valor del nodo a insertar"),
        });
        arbol.insertar(parseInt(valorInsertar));
        console.log(chalk.green(`Nodo ${valorInsertar} insertado`));
        break;

      case "[2] Buscar":
        const { valorBuscar } = await inquirer.prompt({
          type: "input",
          name: "valorBuscar",
          message: chalk.blue("Ingrese el valor del nodo a buscar"),
        });
        const nodo = arbol.buscar(parseInt(valorBuscar));
        if (nodo) {
          console.log(chalk.green(`Nodo encontrado: ${nodo.valor}`));
        } else {
          console.log(chalk.red("Nodo no encontrado"));
        }
        break;

      case "[3] Eliminar":
        const { valorEliminar } = await inquirer.prompt({
          type: "input",
          name: "valorEliminar",
          message: chalk.blue("Ingrese el valor del nodo a eliminar"),
        });
        arbol.eliminar(parseInt(valorEliminar));
        console.log(chalk.green(`Nodo ${valorEliminar} eliminado`));
        break;

      case "[4] PreOrden":
        console.log(chalk.yellow("Recorrido PreOrden:"));
        arbol.preOrden(arbol.getRaiz());
        break;

      case "[5] InOrden":
        console.log(chalk.yellow("Recorrido InOrden:"));
        arbol.inOrden(arbol.getRaiz());
        break;

      case "[6] PostOrden":
        console.log(chalk.yellow("Recorrido PostOrden:"));
        arbol.postOrden(arbol.getRaiz());
        break;

      case "[7] Imprimir Árbol":
        console.log(chalk.yellow("Árbol binario:"));
        arbol.imprimirArbol();
        break;

      case "[8] Salir":
        continuar = false;
        break;
    }
  }
};

main();
