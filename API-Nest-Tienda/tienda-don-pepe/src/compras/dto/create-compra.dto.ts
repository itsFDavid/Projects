
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { DetalleCompraDto } from "./create-detalle-compra.dto";

export class CreateCompraDto {
    @IsNotEmpty()
    @IsNumber()
    clienteId: number;
    
    @ValidateNested({ each: true })
    @Type(() => DetalleCompraDto)
    detalles: DetalleCompraDto[];
}

