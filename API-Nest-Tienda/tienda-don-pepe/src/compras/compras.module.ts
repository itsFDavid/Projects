import { forwardRef, Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProductosModule } from 'src/productos/productos.module';
import { DetalleCompra } from './entities/detallle-compra.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, DetalleCompra]),
    forwardRef(()=> ClientesModule),
    forwardRef(()=> ComprasModule), 
    forwardRef(()=>ProductosModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [TypeOrmModule, ComprasService]
})
export class ComprasModule {}
