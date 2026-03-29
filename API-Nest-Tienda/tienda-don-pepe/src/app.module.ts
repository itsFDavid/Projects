import { Module } from '@nestjs/common';
import { ComprasModule } from './compras/compras.module';
import { ClientesModule } from './clientes/clientes.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { config } from './common/enviroments';
import { FacturasModule } from './facturas/facturas.module';
import { PrinterModule } from './printer/printer.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT) || 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        autoLoadEntities: true,
        // synchronize: true, // Ten cuidado con esto en producción real
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'imagenes'),
      serveRoot: '/imagenes',
    }),
    ComprasModule,
    ClientesModule,
    TiendasModule,
    ProductosModule,
    CommonModule,
    FacturasModule,
    PrinterModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
