import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateClienteDto {
    @IsString()
    @Length(1, 50)
    nombre_cliente: string;
  
    @IsString()
    @Length(1, 50)
    apellido1: string;
  
    @IsString()
    @Length(1, 50)
    @IsOptional()
    apellido2?: string;
  
    @IsString()
    @IsOptional()
    @Type(() => String)
    fecha_nacimiento?: String;
  
    @IsNumber()
    @Min(0)
    @IsOptional()
    puntos_compra?: number;
}
