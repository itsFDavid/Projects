import { IsNumber, IsOptional, IsPositive, IsString, Length, MaxLength, Min} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateProductoDto {

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Laptop Lenovo',
        minLength: 3,
        maxLength: 50,
        required: true
    })
    @IsString()
    @Length(3, 50)
    nombre_producto: string;
    
    @ApiProperty({
        description: 'Descripción del producto',
        example: 'Laptop Lenovo ThinkPad T14s Gen 2',
        maxLength: 255,
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(0, 255)
    descripcion?: string;
    
    @ApiProperty({
        description: 'Precio del producto',
        example: 1000,
        required: true
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    precio: number;
    
    @ApiProperty({
        description: 'Stock del producto',
        example: 10,
        required: true
    })
    @IsNumber()
    @Min(0)
    stock: number;
}
