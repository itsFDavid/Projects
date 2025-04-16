import { forwardRef, Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { ComprasModule } from 'src/compras/compras.module';
import { ProductosModule } from 'src/productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => ComprasModule),
    forwardRef(() => ProductosModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Cliente])
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [TypeOrmModule, ClientesService]
})
export class ClientesModule {}
