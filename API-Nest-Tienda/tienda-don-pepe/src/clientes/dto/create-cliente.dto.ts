import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateClienteDto {
    @ApiProperty({
        example: 'Juan',
        description: 'Nombre del cliente',
        required: true,
      })
    @IsString()
    @Length(1, 50)
    nombre_cliente: string;
  
    @ApiProperty({
        example: 'Perez',
        description: 'Primer apellido del cliente',
        required: true,
      })
    @IsString()
    @Length(1, 50)
    apellido1: string;
  
    @ApiProperty({
        example: 'Gonzalez',
        description: 'Segundo apellido del cliente',
        required: false,
      })
    @IsString()
    @Length(1, 50)
    @IsOptional()
    apellido2?: string;
  
    @ApiProperty({
        example: '2000-01-01',
        description: 'Fecha de nacimiento del cliente',
        required: false,
        })
    @IsString()
    @IsOptional()
    @Type(() => String)
    fecha_nacimiento?: String;

    @ApiProperty({
        example: 'your@email.com',
        description: 'Email del cliente',
        required: true,
      })
    @IsEmail()
    @IsString()
    @Length(1, 50)
    email: string;
  
    @ApiProperty({
        example: 0,
        description: 'Puntos de compra del cliente',
        required: false,
      })
    @IsNumber()
    @Min(0)
    @IsOptional()
    puntos_compra?: number;
}
