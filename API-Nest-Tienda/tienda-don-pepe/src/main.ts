import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

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

  const configService = app.get(ConfigService);

  // Obtén los orígenes permitidos desde la variable de entorno
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS')
    ?.split(',') || [];

  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : '*', // Permite todos si no se define
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

    // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de tiendas don pepe 🏪')
    .setDescription('Documentación de la API para la gestión de compras, tiendas, productos y clientes.')
    .setVersion('1.0')
    .addTag('tiendas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
