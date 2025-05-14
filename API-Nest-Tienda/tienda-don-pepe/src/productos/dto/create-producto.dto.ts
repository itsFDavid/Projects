import { IsNumber, IsOptional, IsPositive, IsString, Length, Max, MaxLength, Min} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateProductoDto {

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Laptop Lenovo',
        minLength: 3,
        maxLength: 50,
        required: true
    })
    @IsString({
        message: 'El nombre del producto debe ser una cadena de texto'
    })
    @Length(3, 50, {message: 'El nombre del producto debe tener entre 3 y 50 caracteres'})
    nombre_producto: string;
    
    @ApiProperty({
        description: 'Descripción del producto',
        example: 'Laptop Lenovo ThinkPad T14s Gen 2',
        maxLength: 255,
        required: false
    })
    @IsString({
        message: 'La descripción debe ser una cadena de texto'
    })
    @IsOptional()
    @Length(0, 255, {message: 'La descripción no puede exceder los 255 caracteres'})
    descripcion?: string;
    
    @ApiProperty({
        description: 'Precio del producto',
        example: 1000,
        required: true
    })
    @IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    }, {
        message: 'El precio debe ser un número'
    })
    @IsPositive({
        message: 'El precio debe ser un número positivo'
    })
    @Min(1, {message: 'El precio no puede ser menor a 1'})
    precio: number;
    
    @ApiProperty({
        description: 'Stock del producto',
        example: 10,
        required: true
    })
    @IsNumber()
    @Min(10, {message: 'El stock no puede ser menor a 10'})
    @Max(250, {message: 'El stock no puede ser mayor a 250'})
    stock: number;
}
