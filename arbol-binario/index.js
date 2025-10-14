import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";



/**
 * Representa un nodo individual en el árbol.
 */
class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.left = null;
    this.right = null;
  }
}

/**
 * Implementación de un Árbol Binario de Búsqueda (BST).
 * La lógica principal de la estructura de datos está contenida aquí.
 */
class ArbolBinario {
  constructor() {
    this.raiz = null;
  }



  /**
   * Inserta un valor en el árbol.
   * @param {number} valor El valor a insertar.
   */
  insertar(valor) {
    this.raiz = this._insertarRecursivo(this.raiz, valor);
  }

  /**
   * Busca un valor en el árbol.
   * @param {number} valor El valor a buscar.
   * @returns {Nodo | null} El nodo encontrado o null si no existe.
   */
  buscar(valor) {
    return this._buscarRecursivo(this.raiz, valor);
  }

  /**
   * Elimina un valor del árbol.
   * @param {number} valor El valor a eliminar.
   */
  eliminar(valor) {
    this.raiz = this._eliminarRecursivo(this.raiz, valor);
  }

  /**
   * Realiza un recorrido InOrden y devuelve los valores.
   * @returns {number[]} Un array con los valores del recorrido.
   */
  recorridoInOrden() {
    const resultado = [];
    this._inOrden(this.raiz, resultado);
    return resultado;
  }

  /**
   * Realiza un recorrido PreOrden y devuelve los valores.
   * @returns {number[]} Un array con los valores del recorrido.
   */
  recorridoPreOrden() {
    const resultado = [];
    this._preOrden(this.raiz, resultado);
    return resultado;
  }

  /**
   * Realiza un recorrido PostOrden y devuelve los valores.
   * @returns {number[]} Un array con los valores del recorrido.
   */
  recorridoPostOrden() {
    const resultado = [];
    this._postOrden(this.raiz, resultado);
    return resultado;
  }

  /**
   * Imprime una representación visual del árbol en la consola.
   */
  imprimir() {
    this._imprimirRecursivo(this.raiz);
  }


  _insertarRecursivo(nodo, valor) {
    if (nodo === null) {
      return new Nodo(valor);
    }

    if (valor < nodo.valor) {
      nodo.left = this._insertarRecursivo(nodo.left, valor);
    } else if (valor > nodo.valor) {
      nodo.right = this._insertarRecursivo(nodo.right, valor);
    }

    return nodo;
  }

  _buscarRecursivo(nodo, valor) {
    if (nodo === null || nodo.valor === valor) {
      return nodo;
    }

    if (valor < nodo.valor) {
      return this._buscarRecursivo(nodo.left, valor);
    }
    return this._buscarRecursivo(nodo.right, valor);
  }

  _eliminarRecursivo(nodo, valor) {
    if (nodo === null) {
      return null;
    }

    if (valor < nodo.valor) {
      nodo.left = this._eliminarRecursivo(nodo.left, valor);
    } else if (valor > nodo.valor) {
      nodo.right = this._eliminarRecursivo(nodo.right, valor);
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

      const sucesor = this._encontrarMinimo(nodo.right);
      nodo.valor = sucesor.valor;
      nodo.right = this._eliminarRecursivo(nodo.right, sucesor.valor);
    }
    return nodo;
  }

  _encontrarMinimo(nodo) {
    let actual = nodo;
    while (actual.left !== null) {
      actual = actual.left;
    }
    return actual;
  }

  _inOrden(nodo, resultado) {
    if (nodo !== null) {
      this._inOrden(nodo.left, resultado);
      resultado.push(nodo.valor);
      this._inOrden(nodo.right, resultado);
    }
  }

  _preOrden(nodo, resultado) {
    if (nodo !== null) {
      resultado.push(nodo.valor);
      this._preOrden(nodo.left, resultado);
      this._preOrden(nodo.right, resultado);
    }
  }

  _postOrden(nodo, resultado) {
    if (nodo !== null) {
      this._postOrden(nodo.left, resultado);
      this._postOrden(nodo.right, resultado);
      resultado.push(nodo.valor);
    }
  }

  _imprimirRecursivo(nodo, prefijo = "", esIzquierdo = true) {
    if (nodo !== null) {
      this._imprimirRecursivo(
        nodo.right,
        prefijo + (esIzquierdo ? "│   " : "    "),
        false
      );
      console.log(
        chalk.cyan(prefijo + (esIzquierdo ? "└── " : "┌── ") + nodo.valor)
      );
      this._imprimirRecursivo(
        nodo.left,
        prefijo + (esIzquierdo ? "    " : "│   "),
        true
      );
    }
  }
}

const TITULO = "Arbol Binario";

/**
 * Muestra el encabezado y el estado actual del árbol.
 * @param {ArbolBinario} arbol La instancia del árbol a imprimir.
 */
const mostrarEstado = (arbol) => {
  console.clear();
  console.log(chalk.yellow(figlet.textSync(TITULO, { font: "Standard" })));
  console.log(chalk.yellow("Estado actual del árbol:"));
  arbol.imprimir();
  console.log("\n");
};

/**
 * Pide al usuario que ingrese un valor numérico.
 * @param {string} mensaje El mensaje a mostrar al usuario.
 * @returns {Promise<number>} El número ingresado por el usuario.
 */
const preguntarValor = async (mensaje) => {
  const { valor } = await inquirer.prompt({
    type: "input",
    name: "valor",
    message: chalk.blue(mensaje),
    validate: (input) =>
      !isNaN(parseInt(input)) || "Por favor, ingrese un número válido.",
  });
  return parseInt(valor);
};

/**
 * Función principal que ejecuta el menú de la aplicación.
 */
const main = async () => {
  const arbol = new ArbolBinario();

  while (true) {
    mostrarEstado(arbol);

    const { opcion } = await inquirer.prompt({
      type: "list",
      name: "opcion",
      message: chalk.green("Seleccione una opción"),
      choices: [
        new inquirer.Separator(),
        { name: "Insertar un nodo", value: "insertar" },
        { name: "Buscar un nodo", value: "buscar" },
        { name: "Eliminar un nodo", value: "eliminar" },
        new inquirer.Separator(),
        { name: "Recorrido PreOrden", value: "preorden" },
        { name: "Recorrido InOrden", value: "inorden" },
        { name: "Recorrido PostOrden", value: "postorden" },
        new inquirer.Separator(),
        { name: "Salir", value: "salir" },
      ],
    });

    if (opcion === "salir") break;

    switch (opcion) {
      case "insertar": {
        const valor = await preguntarValor("Ingrese el valor a insertar:");
        arbol.insertar(valor);
        console.log(chalk.green(`✔️ Nodo ${valor} insertado.`));
        break;
      }
      case "buscar": {
        const valor = await preguntarValor("Ingrese el valor a buscar:");
        const nodo = arbol.buscar(valor);
        if (nodo) {
          console.log(chalk.green(`✔️ Nodo ${nodo.valor} encontrado.`));
        } else {
          console.log(chalk.red(`❌ Nodo ${valor} no encontrado.`));
        }
        break;
      }
      case "eliminar": {
        const valor = await preguntarValor("Ingrese el valor a eliminar:");
        arbol.eliminar(valor);
        console.log(chalk.green(`✔️ Nodo ${valor} eliminado.`));
        break;
      }
      case "preorden":
        console.log(
          chalk.yellow("Recorrido PreOrden:"),
          arbol.recorridoPreOrden().join(" -> ")
        );
        break;
      case "inorden":
        console.log(
          chalk.yellow("Recorrido InOrden:"),
          arbol.recorridoInOrden().join(" -> ")
        );
        break;
      case "postorden":
        console.log(
          chalk.yellow("Recorrido PostOrden:"),
          arbol.recorridoPostOrden().join(" -> ")
        );
        break;
    }

    await inquirer.prompt({
      type: "input",
      name: "pausa",
      message: chalk.dim("Presione Enter para continuar..."),
    });
  }

  console.log(chalk.yellow("¡Hasta luego!"));
};

main();
