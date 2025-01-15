import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
    // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de tiendas don pepe 🏪')
    .setDescription('Documentación de la API para la gestión de compras, tiendas, productos y clientes.')
    .setVersion('1.0')
    .addTag('tiendas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
