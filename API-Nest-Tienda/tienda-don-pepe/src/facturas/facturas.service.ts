import { Injectable } from '@nestjs/common';
import { DetalleCompraDto } from './dto/detalle-compra.dto';
import { PrinterService } from 'src/printer/printer.service';
import { FacturaDoc } from './documents/factura.doc';
import { ComprasService } from 'src/compras/compras.service';

@Injectable()
export class FacturasService {

  constructor(
    private readonly printerService: PrinterService,
    private readonly comprasService: ComprasService,
  ){}


  async generateFactura(id: number): Promise<PDFKit.PDFDocument>{
    const detalleCompraDto = await this.comprasService.findOne(id);
    if (!detalleCompraDto) {
      throw new Error('Compra no encontrada');
    }
    const detalleCompraDtoMapped: DetalleCompraDto = {
      ...detalleCompraDto,
      cliente_: {
        ...detalleCompraDto.cliente_,
        fecha_nacimiento: detalleCompraDto.cliente_.fecha_nacimiento || new Date(), // Provide a default value if missing
      },
      detalles_: detalleCompraDto.detalles_.map(detalle => ({
        ...detalle,
        descripcion: detalle.descripcion || '', // Ensure descripcion is provided
        producto: {
          ...detalle.producto,
          descripcion: detalle.producto.descripcion || '', // Ensure descripcion is provided
        },
      })),
    };
    const docDefinition = FacturaDoc(detalleCompraDtoMapped);
    const pdfDoc = this.printerService.generatePDF(docDefinition);
    return pdfDoc;
  }
}
