import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateSeniorityLevelDto } from './dto/create-seniority-level.dto';
import { Application } from './entities/application.entity';
import { JobRole } from './entities/job-role.entity';
import { SeniorityLevel } from './entities/seniority-level.entity';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let jobRoleRepository: Repository<JobRole>;
  let seniorityLevelRepository: Repository<SeniorityLevel>;
  let applicationRepository: Repository<Application>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Application, JobRole, SeniorityLevel],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Application, JobRole, SeniorityLevel]),
      ],
      providers: [ApplicationsService],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    jobRoleRepository = module.get<Repository<JobRole>>(getRepositoryToken(JobRole));
    seniorityLevelRepository = module.get<Repository<SeniorityLevel>>(getRepositoryToken(SeniorityLevel));
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Job Roles', () => {
    it('should create a job role', async () => {
      const createJobRoleDto: CreateJobRoleDto = {
        name: 'Backend Developer',
        description: 'Responsible for server-side logic',
      };

      const jobRole = await service.createJobRole(createJobRoleDto);

      expect(jobRole).toBeDefined();
      expect(jobRole.name).toBe(createJobRoleDto.name);
      expect(jobRole.description).toBe(createJobRoleDto.description);
    });

    it('should find all job roles', async () => {
      await jobRoleRepository.save({ name: 'Frontend Developer' });
      await jobRoleRepository.save({ name: 'Backend Developer' });

      const jobRoles = await service.findAllJobRoles();

      expect(jobRoles).toHaveLength(2);
      expect(jobRoles[0].name).toBe('Frontend Developer');
      expect(jobRoles[1].name).toBe('Backend Developer');
    });

    it('should find a job role by ID', async () => {
      const jobRole = await jobRoleRepository.save({ name: 'DevOps Engineer' });

      const foundJobRole = await service.findJobRoleById(jobRole.job_role_id);

      expect(foundJobRole).toBeDefined();
      expect(foundJobRole.name).toBe('DevOps Engineer');
    });

    it('should throw NotFoundException if job role not found', async () => {
      await expect(service.findJobRoleById('non-existent-id')).rejects.toThrow('Job role with ID non-existent-id not found');
    });
  });

  describe('Seniority Levels', () => {
    it('should create a seniority level', async () => {
      const createSeniorityLevelDto: CreateSeniorityLevelDto = {
        name: 'Senior',
        description: 'More than 5 years of experience',
      };

      const seniorityLevel = await service.createSeniorityLevel(createSeniorityLevelDto);

      expect(seniorityLevel).toBeDefined();
      expect(seniorityLevel.name).toBe(createSeniorityLevelDto.name);
      expect(seniorityLevel.description).toBe(createSeniorityLevelDto.description);
    });

    it('should find all seniority levels', async () => {
      await seniorityLevelRepository.save({ name: 'Junior' });
      await seniorityLevelRepository.save({ name: 'Mid-level' });

      const seniorityLevels = await service.findAllSeniorityLevels();

      expect(seniorityLevels).toHaveLength(2);
      expect(seniorityLevels[0].name).toBe('Junior');
      expect(seniorityLevels[1].name).toBe('Mid-level');
    });

    it('should find a seniority level by ID', async () => {
      const seniorityLevel = await seniorityLevelRepository.save({ name: 'Lead' });

      const foundSeniorityLevel = await service.findSeniorityLevelById(seniorityLevel.seniority_id);

      expect(foundSeniorityLevel).toBeDefined();
      expect(foundSeniorityLevel.name).toBe('Lead');
    });

    it('should throw NotFoundException if seniority level not found', async () => {
      await expect(service.findSeniorityLevelById('non-existent-id')).rejects.toThrow('Seniority level with ID non-existent-id not found');
    });
  });

  describe('Applications', () => {
    it('should create an application', async () => {
      const jobRole = await jobRoleRepository.save({ name: 'Backend Developer' });
      const seniorityLevel = await seniorityLevelRepository.save({ name: 'Senior' });

      const createApplicationDto: CreateApplicationDto = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        enterprise_id: '123e4567-e89b-12d3-a456-426614174001',
        job_role_id: jobRole.job_role_id,
        seniority_id: seniorityLevel.seniority_id,
        external_job_id: 'EXT-JOB-123',
        external_application_id: 'EXT-APP-123',
      };

      const application = await service.createApplication(createApplicationDto);

      expect(application).toBeDefined();
      expect(application.user_id).toBe(createApplicationDto.user_id);
      expect(application.enterprise_id).toBe(createApplicationDto.enterprise_id);
      expect(application.job_role.name).toBe('Backend Developer');
      expect(application.seniority.name).toBe('Senior');
    });

    it('should find all applications', async () => {
      const jobRole = await jobRoleRepository.save({ name: 'Backend Developer' });
      const seniorityLevel = await seniorityLevelRepository.save({ name: 'Senior' });

      await applicationRepository.save({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        enterprise_id: '123e4567-e89b-12d3-a456-426614174001',
        job_role: jobRole,
        seniority: seniorityLevel,
      });

      const applications = await service.findAllApplications();

      expect(applications).toHaveLength(1);
      expect(applications[0].job_role.name).toBe('Backend Developer');
      expect(applications[0].seniority.name).toBe('Senior');
    });
  });
});