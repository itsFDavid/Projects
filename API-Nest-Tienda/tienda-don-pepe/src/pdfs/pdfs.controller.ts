import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { PdfsService } from './pdfs.service';
import { Response } from 'express';
import { DetalleCompra } from 'src/common/interfaces/detalle-compra.interface';

@Controller('pdfs')
export class PdfsController {
  constructor(private readonly pdfsService: PdfsService) {}

  @Post('generate')
  async generateAndDownload(
    @Res() res: Response,
    @Body() data: DetalleCompra
  ) {

    const filePath = await this.pdfsService.generatePDF(data);
    res.download(filePath);
  }
}
