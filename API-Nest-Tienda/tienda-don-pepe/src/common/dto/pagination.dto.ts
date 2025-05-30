import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        example: 10,
        description: 'Cantidad de elementos a obtener',
        required: false,
      })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        example: 0,
        description: 'Cantidad de elementos a omitir',
        required: false,
      })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}