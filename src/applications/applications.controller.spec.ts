import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateSeniorityLevelDto } from './dto/create-seniority-level.dto';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  // Mock data
  const mockJobRole = {
    job_role_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Backend Developer',
    description: 'Backend development role',
    created_at: new Date(),
  };

  const mockSeniorityLevel = {
    seniority_id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Senior',
    description: 'Senior level',
    created_at: new Date(),
  };

  const mockApplication = {
    application_id: '123e4567-e89b-12d3-a456-426614174002',
    user_id: '123e4567-e89b-12d3-a456-426614174003',
    enterprise_id: '123e4567-e89b-12d3-a456-426614174004',
    job_role: mockJobRole,
    seniority: mockSeniorityLevel,
    external_job_id: 'EXT-JOB-123',
    external_application_id: 'EXT-APP-123',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            createJobRole: jest.fn().mockResolvedValue(mockJobRole),
            findAllJobRoles: jest.fn().mockResolvedValue([mockJobRole]),
            findJobRoleById: jest.fn().mockResolvedValue(mockJobRole),
            createSeniorityLevel: jest.fn().mockResolvedValue(mockSeniorityLevel),
            findAllSeniorityLevels: jest.fn().mockResolvedValue([mockSeniorityLevel]),
            findSeniorityLevelById: jest.fn().mockResolvedValue(mockSeniorityLevel),
            createApplication: jest.fn().mockResolvedValue(mockApplication),
            findAllApplications: jest.fn().mockResolvedValue([mockApplication]),
            findApplicationById: jest.fn().mockResolvedValue(mockApplication),
            findApplicationsByUserId: jest.fn().mockResolvedValue([mockApplication]),
            findApplicationsByEnterpriseId: jest.fn().mockResolvedValue([mockApplication]),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Job Roles', () => {
    it('should create a job role', async () => {
      const createJobRoleDto: CreateJobRoleDto = {
        name: 'Backend Developer',
        description: 'Backend development role',
      };

      const result = await controller.createJobRole(createJobRoleDto);

      expect(result).toEqual(mockJobRole);
      expect(service.createJobRole).toHaveBeenCalledWith(createJobRoleDto);
    });

    it('should find all job roles', async () => {
      const result = await controller.findAllJobRoles();

      expect(result).toEqual([mockJobRole]);
      expect(service.findAllJobRoles).toHaveBeenCalled();
    });

    it('should find a job role by ID', async () => {
      const result = await controller.findJobRoleById(mockJobRole.job_role_id);

      expect(result).toEqual(mockJobRole);
      expect(service.findJobRoleById).toHaveBeenCalledWith(mockJobRole.job_role_id);
    });

    it('should throw NotFoundException when job role not found', async () => {
      jest.spyOn(service, 'findJobRoleById').mockRejectedValue(new NotFoundException());

      await expect(controller.findJobRoleById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Seniority Levels', () => {
    it('should create a seniority level', async () => {
      const createSeniorityLevelDto: CreateSeniorityLevelDto = {
        name: 'Senior',
        description: 'Senior level',
      };

      const result = await controller.createSeniorityLevel(createSeniorityLevelDto);

      expect(result).toEqual(mockSeniorityLevel);
      expect(service.createSeniorityLevel).toHaveBeenCalledWith(createSeniorityLevelDto);
    });

    it('should find all seniority levels', async () => {
      const result = await controller.findAllSeniorityLevels();

      expect(result).toEqual([mockSeniorityLevel]);
      expect(service.findAllSeniorityLevels).toHaveBeenCalled();
    });

    it('should find a seniority level by ID', async () => {
      const result = await controller.findSeniorityLevelById(mockSeniorityLevel.seniority_id);

      expect(result).toEqual(mockSeniorityLevel);
      expect(service.findSeniorityLevelById).toHaveBeenCalledWith(mockSeniorityLevel.seniority_id);
    });

    it('should throw NotFoundException when seniority level not found', async () => {
      jest.spyOn(service, 'findSeniorityLevelById').mockRejectedValue(new NotFoundException());

      await expect(controller.findSeniorityLevelById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Applications', () => {
    it('should create an application', async () => {
      const createApplicationDto: CreateApplicationDto = {
        user_id: mockApplication.user_id,
        enterprise_id: mockApplication.enterprise_id,
        job_role_id: mockJobRole.job_role_id,
        seniority_id: mockSeniorityLevel.seniority_id,
        external_job_id: mockApplication.external_job_id,
        external_application_id: mockApplication.external_application_id,
      };

      const result = await controller.createApplication(createApplicationDto);

      expect(result).toEqual(mockApplication);
      expect(service.createApplication).toHaveBeenCalledWith(createApplicationDto);
    });

    it('should find all applications', async () => {
      const result = await controller.findAllApplications();

      expect(result).toEqual([mockApplication]);
      expect(service.findAllApplications).toHaveBeenCalled();
    });

    it('should find an application by ID', async () => {
      const result = await controller.findApplicationById(mockApplication.application_id);

      expect(result).toEqual(mockApplication);
      expect(service.findApplicationById).toHaveBeenCalledWith(mockApplication.application_id);
    });

    it('should find applications by user ID', async () => {
      const result = await controller.findApplicationsByUserId(mockApplication.user_id);

      expect(result).toEqual([mockApplication]);
      expect(service.findApplicationsByUserId).toHaveBeenCalledWith(mockApplication.user_id);
    });

    it('should find applications by enterprise ID', async () => {
      const result = await controller.findApplicationsByEnterpriseId(mockApplication.enterprise_id);

      expect(result).toEqual([mockApplication]);
      expect(service.findApplicationsByEnterpriseId).toHaveBeenCalledWith(mockApplication.enterprise_id);
    });

    it('should throw NotFoundException when application not found', async () => {
      jest.spyOn(service, 'findApplicationById').mockRejectedValue(new NotFoundException());

      await expect(controller.findApplicationById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});