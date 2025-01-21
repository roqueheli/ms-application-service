import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuración de Redis Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6380),
      retryAttempts: 5,
      retryDelay: 1000,
    },
  });

  // Configuración global de pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Configuración de seguridad
  app.use(helmet());
  app.use(compression());
  app.enableCors();

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Applications Service API')
    .setDescription('API for managing job applications, roles, and seniority levels')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Applications')
    .addTag('Health Check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Iniciar microservicio Redis
  await app.startAllMicroservices();

  // Puerto de la aplicación
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  // Logging
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(`📚 Swagger documentation is available at: ${await app.getUrl()}/api/docs`);
  console.log(`📮 Redis microservice is running on: ${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`);
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception:', error);
});

bootstrap();