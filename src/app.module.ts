import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { Application } from './applications/entities/application.entity';
import { JobRole } from './applications/entities/job-role.entity';
import { SeniorityLevel } from './applications/entities/seniority-level.entity';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Application, JobRole, SeniorityLevel],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false
        } : false,
      }),
      inject: [ConfigService],
    }),
    // Configuración de Redis
    ClientsModule.registerAsync([
      {
        name: 'APPLICATION_SERVICE', // Nombre del servicio Redis
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6380),
            retryAttempts: 5,
            retryDelay: 1000,
            tls: configService.get('NODE_ENV') === 'production' ? {
              rejectUnauthorized: false
            } : undefined,
            reconnectOnError: (err) => {
              console.log('Redis reconnection error:', err);
              return true;
            },
            retryStrategy: (times) => {
              const delay = Math.min(times * 1000, 5000);
              console.log(`Redis retry attempt ${times} with delay ${delay}ms`);
              return delay;
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    // Módulos de la aplicación
    ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }