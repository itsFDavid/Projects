import { IsArray, IsString, Length } from "class-validator";

export class CreateTiendaDto {
    @IsString()
    @Length(1, 100)
    nombre_tienda: string;

}
