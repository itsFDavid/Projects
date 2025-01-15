import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class DetalleCompraDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    productoId: number;
  
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    cantidad_productos: number;
}