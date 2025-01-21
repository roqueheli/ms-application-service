import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { JobRole } from './entities/job-role.entity';
import { SeniorityLevel } from './entities/seniority-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, JobRole, SeniorityLevel]),
    ClientsModule.registerAsync([
      {
        name: 'APPLICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6380),
            retryAttempts: 5,
            retryDelay: 1000,
            tls: configService.get('REDIS_TLS_ENABLED', false) ? {} : undefined,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}