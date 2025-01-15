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
      host: process.env.DATABASE_HOST_PROD || 'localhost',
      port: process.env.DATABASE_PORT_PROD ? parseInt(process.env.DATABASE_PORT) : 3306,
      username: process.env.MYSQL_USER_PROD,
      password: process.env.MYSQL_PASSWORD_PROD,
      database: process.env.MYSQL_DATABASE_PROD,
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
