import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { JobRole } from './entities/job-role.entity';
import { SeniorityLevel } from './entities/seniority-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, JobRole, SeniorityLevel]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule { }