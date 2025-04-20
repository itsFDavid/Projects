import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Cliente as ClienteType, Detalle, Tienda as TiendaType } from "src/common/interfaces/detalle-compra.interface";

// Crea clases en lugar de interfaces para que class-validator pueda usarlas
export class ClienteDto implements ClienteType {
  @IsNumber()
  id_cliente: number;

  @IsNotEmpty()
  nombre_cliente: string;

  @IsNotEmpty()
  apellido1: string;

  @IsOptional()
  apellido2?: string|null;

  @IsDate()
  @Type(() => Date)
  fecha_nacimiento: Date;

  @IsNumber()
  puntos_compra: number;

  @IsDate()
  @Type(() => Date)
  fecha_registro: Date;
}

export class ProductoDto {
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  nombre_producto: string;

  @IsOptional()
  descripcion: string | null;

  @IsNumber()
  precio: number;

  @IsNumber()
  stock: number;
}

export class DetalleDto implements Detalle {
  @IsNumber()
  total: number;

  @IsNumber()
  cantidad_productos: number;

  @IsNumber()
  precio_unitario: number;

  @ValidateNested()
  @Type(() => ProductoDto)
  producto: ProductoDto;

  @IsOptional()
  descripcion: string|null;

  @IsNumber()
  id_detalle_compra: number;
}

export class TiendaDto implements TiendaType {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false
  }, {
    message: 'id_tienda debe ser un número'
  })
  id_tienda: number;

  @IsNotEmpty({
    message: 'nombre_tienda no puede estar vacío'
  })
  nombre_tienda: string;
}

export class DetalleCompraDto {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false
  }, {
    message: 'id_compra debe ser un número'
  })
  id_compra: number;

  @IsDate({
    message: 'fecha_compra debe ser una fecha válida'
  })
  @Type(() => Date)
  fecha_compra: Date;

  @ValidateNested({
    message: 'cliente_ debe ser un objeto válido'
  })
  @Type(() => ClienteDto)
  cliente_: ClienteDto;

  @IsArray()
  @ValidateNested({ each: true, message: 'detalles_ debe ser un array de objetos válidos' })
  @Type(() => DetalleDto)
  detalles_: DetalleDto[];

  @ValidateNested({ 
    message: 'tienda_ debe ser un objeto válido'
  })
  @Type(() => TiendaDto)
  tienda_: TiendaDto;
}
