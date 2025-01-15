import { PartialType } from '@nestjs/mapped-types';
import { DetalleCompraDto } from './create-detalle-compra.dto';

export class UpdateDetalleCompraDto extends PartialType(DetalleCompraDto) {}
