
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { DetalleCompraDto } from "./create-detalle-compra.dto";

export class CreateCompraDto {
    @IsNotEmpty()
    @IsNumber()
    clienteId: number;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    tiendaId: number;

    @ValidateNested({ each: true })
    @Type(() => DetalleCompraDto)
    detalles: DetalleCompraDto[];
}

