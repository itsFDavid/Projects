import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DetalleCompraDto {
    @ApiProperty({
        example: 1,
        description: 'Id del producto a comprar',
        required: true,
      })
    @IsNumber()
    @Min(1)
    productoId: number;
  
    @ApiProperty({
        example: 2,
        description: 'Cantidad de productos a comprar',
        required: true,
      })
    @IsNumber()
    @Min(1)
    cantidad_productos: number;
}