
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { DetalleCompraDto } from "./create-detalle-compra.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCompraDto {
    @ApiProperty({
        example: 1,
        description: 'Id del cliente que realiza la compra',
        required: true,
      })
    @IsNotEmpty()
    @IsNumber()
    clienteId: number;
    
    @ApiProperty({
        example: 1,
        description: 'Id de la tienda donde se realiza la compra',
        required: true,
      })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    tiendaId: number;

      @ApiProperty({
        description: 'Lista de detalles de la compra',
        type: DetalleCompraDto,
        isArray: true,
        required: true,
        example: [
            {
                productoId: 1,
                cantidad_productos: 2
            },
            {
                productoId: 2,
                cantidad_productos: 3
            }
        ]
      })
    @ValidateNested({ each: true })
    @Type(() => DetalleCompraDto)
    detalles: DetalleCompraDto[];
}

