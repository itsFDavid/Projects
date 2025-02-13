import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { join } from 'path';
import { DetalleCompra } from 'src/common/interfaces/detalle-compra.interface';

@Injectable()
export class PdfsService {

  async generatePDF(data: DetalleCompra): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4'});
      const filePath = join(__dirname, '../../uploads/report.pdf');
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Encabezado
      doc.fontSize(20).text('Factura de Compra', { align: 'center' }).moveDown(2);

      // Datos del Cliente
      doc.fontSize(12).text(`Cliente: ${data.cliente_.nombre_cliente} ${data.cliente_.apellido1} ${data.cliente_.apellido2 ?? ''}`);
      doc.text(`Fecha de Compra: ${new Date().toLocaleDateString()}`).moveDown(1);
      doc.text(`Puntos Acumulados: ${data.cliente_.puntos_compra}`).moveDown(2);

      // Tienda
      doc.fontSize(14).text(`Tienda: ${data.tienda_.nombre_tienda}`, { align: 'left' }).moveDown(1);

      // Cabecera de la Tabla
      const tableTop = doc.y + 10;
      const columnWidths = [100, 100, 100, 100]; // Ancho de cada columna

      doc.fontSize(12).text('Producto', columnWidths[0], tableTop);
      doc.text('Cantidad', columnWidths[0] + columnWidths[1], tableTop, { width: columnWidths[1], align: 'center' });
      doc.text('Precio Unitario', columnWidths[0] + columnWidths[1] + columnWidths[2], tableTop, { width: columnWidths[2], align: 'center' });
      doc.text('Total', columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], tableTop, { width: columnWidths[3], align: 'right' });
      
      doc.moveDown(1);

      // Línea de separación para la tabla
      doc.moveTo(columnWidths[0], doc.y).lineTo(columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3]+100, doc.y).stroke();

      // Detalles de los Productos en la tabla
      let yPosition = doc.y + 10;
      data.detalles_.forEach((detalle, index) => {
        doc.fontSize(10).text(detalle.producto.nombre_producto, columnWidths[0], yPosition, { width: columnWidths[0], align: 'left' });
        doc.text(detalle.cantidad_productos.toString(), columnWidths[0] + columnWidths[1], yPosition, { width: columnWidths[1], align: 'center' });
        doc.text(`$${detalle.precio_unitario.toFixed(2)}`, columnWidths[0] + columnWidths[1] + columnWidths[2], yPosition, { width: columnWidths[2], align: 'center' });
        doc.text(`$${detalle.total.toFixed(2)}`, columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], yPosition, { width: columnWidths[3], align: 'right' });

        // Línea de separación para cada fila
        doc.moveTo(columnWidths[0], yPosition + 15).lineTo(columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3]+100, yPosition + 15).stroke();

        yPosition += 20;  // Espaciado entre filas
      });

      // Total de la Compra
      const totalCompra = data.detalles_.reduce((sum, d) => sum + d.total, 0);
      doc.fontSize(14).text(`Total: $${totalCompra.toFixed(2)}`, columnWidths[4], yPosition).moveDown(2);

      // Finalizar PDF
      doc.end();

      // Esperar que el archivo PDF se genere
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    });
  }
}
