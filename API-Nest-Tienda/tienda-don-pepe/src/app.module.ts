import { Module } from '@nestjs/common';
import { ComprasModule } from './compras/compras.module';
import { ClientesModule } from './clientes/clientes.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ComprasModule,
    ClientesModule,
    TiendasModule,
    ProductosModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
