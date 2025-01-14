import { IsNumber, IsOptional, IsPositive, IsString, Length, MaxLength, Min} from "class-validator";

export class CreateProductoDto {

    @IsString()
    @Length(3, 50)
    nombre_producto: string;
    
    @IsString()
    @IsOptional()
    @Length(0, 255)
    descripcion?: string;
    
    @IsNumber()
    @IsPositive()
    @Min(0)
    precio: number;
    
    @IsNumber()
    @Min(0)
    stock: number;
}
