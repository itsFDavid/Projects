import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { DetalleCompraDto } from './dto/detalle-compra.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { ValidRoles } from 'src/auth/interfaces';
import { RoleProtected } from 'src/auth/decorators';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('generate/:id')
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  async generateFactura(
    // @Body() detalleCompraDto: DetalleCompraDto,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const pdfDoc = await this.facturasService.generateFactura(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  }
}
