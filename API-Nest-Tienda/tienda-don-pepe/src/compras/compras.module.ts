import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProductosModule } from 'src/productos/productos.module';
import { DetalleCompra } from './entities/detallle-compra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, DetalleCompra]),
    ClientesModule, ComprasModule, ProductosModule
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [TypeOrmModule]
})
export class ComprasModule {}
