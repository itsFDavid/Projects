import { Module } from '@nestjs/common';
import { ComprasModule } from './compras/compras.module';
import { ClientesModule } from './clientes/clientes.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { config } from './common/enviroments';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const enviroment = process.env.NODE_ENV === 'prod' ? 'prod' : 'local';
        return {
          type: 'mysql',
          ...config.enviroments[enviroment],
          autoLoadEntities: true,
          synchronize: true,
        }
      }
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
