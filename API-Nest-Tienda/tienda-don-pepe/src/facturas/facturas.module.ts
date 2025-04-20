import { forwardRef, Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { ComprasModule } from 'src/compras/compras.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService],
  imports: [
    forwardRef(() => PrinterModule), 
    forwardRef(() => ComprasModule),
    forwardRef(() => AuthModule)
  ]
})
export class FacturasModule {}
