export type Cliente = {
    id_cliente: number;
    nombre_cliente: string;
    apellido1: string;
    apellido2?: string | null;
    fecha_nacimiento: Date;
    puntos_compra: number;
    fecha_registro: Date;
}
export type Producto = {
    id_producto: number;
    nombre_producto: string;
    descripcion: string|null;
    precio: number;
    stock: number;
}

export type Detalle = {
    id_detalle_compra: number;
    total: number;
    descripcion: string|null;
    cantidad_productos: number;
    precio_unitario: number;
    producto: Producto;
}
export type Tienda = {
    id_tienda: number;
    nombre_tienda: string;
}

export interface DetalleCompra {
    id_compra: number;
    fecha_compra: Date;
    cliente_: Cliente;
    detalles_: Detalle[];
    tienda_: Tienda;
}
