import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs'; // Importar 'of' para crear observables
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateSeniorityLevelDto } from './dto/create-seniority-level.dto';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;
  let client: ClientProxy;

  const mockApplicationService = {
    createJobRole: jest.fn(),
    findAllJobRoles: jest.fn(),
    findJobRoleById: jest.fn(),
    createSeniorityLevel: jest.fn(),
    findAllSeniorityLevels: jest.fn(),
    findSeniorityLevelById: jest.fn(),
    createApplication: jest.fn(),
    findAllApplications: jest.fn(),
    findApplicationById: jest.fn(),
    findApplicationsByUserId: jest.fn(),
    findApplicationsByEnterpriseId: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
    send: jest.fn().mockImplementation((pattern, data) => {
      if (pattern === 'verify_user') {
        // Simular que el usuario existe
        return of(data === 'valid_user_id'); // Devolver un observable que simula que el usuario existe
      }
      if (pattern === 'verify_enterprise') {
        // Simular que la empresa existe
        return of(data === 'valid_enterprise_id'); // Devolver un observable que simula que la empresa existe
      }
      return of(null); // Devolver un observable vacío para otros patrones
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockApplicationService,
        },
        {
          provide: 'APPLICATION_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
    client = module.get<ClientProxy>('APPLICATION_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Job Roles', () => {
    it('should create a new job role', async () => {
      const createJobRoleDto: CreateJobRoleDto = { name: 'Developer' };
      const jobRole = { id: '1', ...createJobRoleDto };

      mockApplicationService.createJobRole.mockResolvedValue(jobRole);

      const result = await controller.createJobRole(createJobRoleDto);

      expect(result).toEqual(jobRole);
      expect(mockApplicationService.createJobRole).toHaveBeenCalledWith(createJobRoleDto);
      expect(client.emit).toHaveBeenCalledWith('job_role_created', {
        role: jobRole,
        timestamp: expect.any(Date),
      });
    });

    it('should get all job roles', async () => {
      const jobRoles = [{ id: '1', name: 'Developer' }];
      mockApplicationService.findAllJobRoles.mockResolvedValue(jobRoles);

      const result = await controller.findAllJobRoles();

      expect(result).toEqual(jobRoles);
      expect(mockApplicationService.findAllJobRoles).toHaveBeenCalled();
    });

    it('should get a job role by ID', async () => {
      const jobRole = { id: '1', name: 'Developer' };
      mockApplicationService.findJobRoleById.mockResolvedValue(jobRole);

      const result = await controller.findJobRoleById('1');

      expect(result).toEqual(jobRole);
      expect(mockApplicationService.findJobRoleById).toHaveBeenCalledWith('1');
    });
  });

  describe('Seniority Levels', () => {
    it('should create a new seniority level', async () => {
      const createSeniorityLevelDto: CreateSeniorityLevelDto = { name: 'Senior' };
      const seniorityLevel = { id: '1', ...createSeniorityLevelDto };

      mockApplicationService.createSeniorityLevel.mockResolvedValue(seniorityLevel);

      const result = await controller.createSeniorityLevel(createSeniorityLevelDto);

      expect(result).toEqual(seniorityLevel);
      expect(mockApplicationService.createSeniorityLevel).toHaveBeenCalledWith(createSeniorityLevelDto);
      expect(client.emit).toHaveBeenCalledWith('seniority_level_created', {
        level: seniorityLevel,
        timestamp: expect.any(Date),
      });
    });

    it('should get all seniority levels', async () => {
      const seniorityLevels = [{ id: '1', level: 'Senior' }];
      mockApplicationService.findAllSeniorityLevels.mockResolvedValue(seniorityLevels);

      const result = await controller.findAllSeniorityLevels();

      expect(result).toEqual(seniorityLevels);
      expect(mockApplicationService.findAllSeniorityLevels).toHaveBeenCalled();
    });

    it('should get a seniority level by ID', async () => {
      const seniorityLevel = { id: '1', level: 'Senior' };
      mockApplicationService.findSeniorityLevelById.mockResolvedValue(seniorityLevel);

      const result = await controller.findSeniorityLevelById('1');

      expect(result).toEqual(seniorityLevel);
      expect(mockApplicationService.findSeniorityLevelById).toHaveBeenCalledWith('1');
    });
  });

  describe('Applications', () => {
    it('should create a new application', async () => {
      const createApplicationDto: CreateApplicationDto = {
        user_id: 'valid_user_id', // Asegúrate de que este ID sea válido
        enterprise_id: 'valid_enterprise_id', // Asegúrate de que este ID sea válido
        job_role_id: '1',
        seniority_id: 'valid_seniority',
      };
      const application = { id: '1', ...createApplicationDto };

      mockApplicationService.createApplication.mockResolvedValue(application);

      const result = await controller.createApplication(createApplicationDto);

      expect(result).toEqual(application);
      expect(mockApplicationService.createApplication).toHaveBeenCalledWith(createApplicationDto);
      expect(client.emit).toHaveBeenCalledWith('application_created', {
        application,
        timestamp: expect.any(Date),
      });
    });

    it('should get all applications', async () => {
      const applications = [{ id: '1', user_id: 'valid_user_id' }];
      mockApplicationService.findAllApplications.mockResolvedValue(applications);

      const result = await controller.findAllApplications();

      expect(result).toEqual(applications);
      expect(mockApplicationService.findAllApplications).toHaveBeenCalled();
    });

    it('should get an application by ID', async () => {
      const application = { id: '1', user_id: 'valid_user_id' };
      mockApplicationService.findApplicationById.mockResolvedValue(application);

      const result = await controller.findApplicationById('1');

      expect(result).toEqual(application);
      expect(mockApplicationService.findApplicationById).toHaveBeenCalledWith('1');
    });

    it('should get applications by user ID', async () => {
      const applications = [{ id: '1', user_id: 'valid_user_id' }];
      mockApplicationService.findApplicationsByUserId.mockResolvedValue(applications);

      const result = await controller.findApplicationsByUserId('valid_user_id');

      expect(result).toEqual(applications);
      expect(mockApplicationService.findApplicationsByUserId).toHaveBeenCalledWith('valid_user_id');
    });

    it('should get applications by enterprise ID', async () => {
      const applications = [{ id: '1', enterprise_id: 'valid_enterprise_id' }];
      mockApplicationService.findApplicationsByEnterpriseId.mockResolvedValue(applications);

      const result = await controller.findApplicationsByEnterpriseId('valid_enterprise_id');

      expect(result).toEqual(applications);
      expect(mockApplicationService.findApplicationsByEnterpriseId).toHaveBeenCalledWith('valid_enterprise_id');
    });
  });
});
