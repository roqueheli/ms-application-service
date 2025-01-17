import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateSeniorityLevelDto } from './dto/create-seniority-level.dto';
import { Application } from './entities/application.entity';
import { JobRole } from './entities/job-role.entity';
import { SeniorityLevel } from './entities/seniority-level.entity';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
        @InjectRepository(JobRole)
        private jobRoleRepository: Repository<JobRole>,
        @InjectRepository(SeniorityLevel)
        private seniorityLevelRepository: Repository<SeniorityLevel>,
    ) { }

    // Métodos para JobRole
    async createJobRole(createJobRoleDto: CreateJobRoleDto): Promise<JobRole> {
        const jobRole = this.jobRoleRepository.create(createJobRoleDto);
        return await this.jobRoleRepository.save(jobRole);
    }

    async findAllJobRoles(): Promise<JobRole[]> {
        return await this.jobRoleRepository.find();
    }

    async findJobRoleById(id: string): Promise<JobRole> {
        const jobRole = await this.jobRoleRepository.findOne({ where: { job_role_id: id } });
        if (!jobRole) {
            throw new NotFoundException(`Job role with ID ${id} not found`);
        }
        return jobRole;
    }

    // Métodos para SeniorityLevel
    async createSeniorityLevel(createSeniorityLevelDto: CreateSeniorityLevelDto): Promise<SeniorityLevel> {
        const seniorityLevel = this.seniorityLevelRepository.create(createSeniorityLevelDto);
        return await this.seniorityLevelRepository.save(seniorityLevel);
    }

    async findAllSeniorityLevels(): Promise<SeniorityLevel[]> {
        return await this.seniorityLevelRepository.find();
    }

    async findSeniorityLevelById(id: string): Promise<SeniorityLevel> {
        const seniorityLevel = await this.seniorityLevelRepository.findOne({ where: { seniority_id: id } });
        if (!seniorityLevel) {
            throw new NotFoundException(`Seniority level with ID ${id} not found`);
        }
        return seniorityLevel;
    }

    // Métodos para Application
    async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
        // Verificar que existan el rol y el nivel de seniority
        const jobRole = await this.findJobRoleById(createApplicationDto.job_role_id);
        const seniorityLevel = await this.findSeniorityLevelById(createApplicationDto.seniority_id);

        const application = this.applicationRepository.create({
            ...createApplicationDto,
            job_role: jobRole,
            seniority: seniorityLevel,
        });

        return await this.applicationRepository.save(application);
    }

    async findAllApplications(): Promise<Application[]> {
        return await this.applicationRepository.find({
            relations: ['job_role', 'seniority'],
        });
    }

    async findApplicationById(id: string): Promise<Application> {
        const application = await this.applicationRepository.findOne({
            where: { application_id: id },
            relations: ['job_role', 'seniority'],
        });

        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found`);
        }

        return application;
    }

    async findApplicationsByUserId(userId: string): Promise<Application[]> {
        return await this.applicationRepository.find({
            where: { user_id: userId },
            relations: ['job_role', 'seniority'],
        });
    }

    async findApplicationsByEnterpriseId(enterpriseId: string): Promise<Application[]> {
        return await this.applicationRepository.find({
            where: { enterprise_id: enterpriseId },
            relations: ['job_role', 'seniority'],
        });
    }
}