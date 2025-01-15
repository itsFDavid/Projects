import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, Length } from "class-validator";

export class CreateTiendaDto {

    @ApiProperty({
        description: 'Nombre de la tienda',
        type: String,
        required: true,
        default: 'Tienda de prueba',
        maxLength: 100,
        example: 'Tienda de prueba'
    })
    @IsString()
    @Length(1, 100)
    nombre_tienda: string;

}
