import { Module } from '@nestjs/common';
import { PdfsService } from './pdfs.service';
import { PdfsController } from './pdfs.controller';

@Module({
  controllers: [PdfsController],
  providers: [PdfsService],
})
export class PdfsModule {}
