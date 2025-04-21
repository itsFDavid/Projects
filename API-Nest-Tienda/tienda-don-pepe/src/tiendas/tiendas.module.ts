import { forwardRef, Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from './entities/tienda.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports:[TypeOrmModule.forFeature([Tienda]), forwardRef(() => AuthModule)],
  controllers: [TiendasController],
  providers: [TiendasService],
  exports: [TypeOrmModule]
})
export class TiendasModule {}
