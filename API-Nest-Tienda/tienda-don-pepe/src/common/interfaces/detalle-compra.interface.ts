type Cliente = {
    id_cliente: number;
    nombre_cliente: string;
    apellido1: string;
    apellido2: string;
    fecha_nacimiento: Date;
    puntos_compra: number;
    fecha_registro: Date;
}
type Producto = {
    id_producto: number;
    nombre_producto: string;
    descripcion: string|null;
    precio: number;
    stock: number;
}

type Detalle = {
    id_detalle_compra: number;
    total: number;
    descripcion: string|null;
    cantidad_productos: number;
    precio_unitario: number;
    producto: Producto;
}
type Tienda = {
    id_tienda: number;
    nombre_tienda: string;
}

export interface DetalleCompra {
    id_detalle_compra: number;
    fecha_compra: Date;
    cliente_: Cliente;
    detalles_: Detalle[];
    tienda_: Tienda;
}
