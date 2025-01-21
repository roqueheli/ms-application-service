import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateSeniorityLevelDto } from './dto/create-seniority-level.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly applicationsService: ApplicationsService,
        @Inject('APPLICATION_SERVICE') private readonly applicationClient: ClientProxy,
    ) { }

    // Job Roles endpoints
    @Post('job-roles')
    @ApiOperation({ summary: 'Create a new job role' })
    @ApiResponse({ status: 201, description: 'Job role created successfully' })
    async createJobRole(@Body() createJobRoleDto: CreateJobRoleDto) {
        const jobRole = await this.applicationsService.createJobRole(createJobRoleDto);
        // Emitir evento cuando se crea un nuevo rol
        this.applicationClient.emit('job_role_created', {
            role: jobRole,
            timestamp: new Date(),
        });
        return jobRole;
    }

    @EventPattern('job_role_created')
    async handleJobRoleCreated(data: any) {
        console.log('Nuevo rol de trabajo creado:', data);
        // Aquí puedes agregar lógica adicional para manejar el evento
    }

    @Get('job-roles')
    @ApiOperation({ summary: 'Get all job roles' })
    @ApiResponse({ status: 200, description: 'List of all job roles' })
    async findAllJobRoles() {
        return await this.applicationsService.findAllJobRoles();
    }

    @Get('job-roles/:id')
    @ApiOperation({ summary: 'Get a job role by ID' })
    @ApiResponse({ status: 200, description: 'Job role found' })
    @ApiResponse({ status: 404, description: 'Job role not found' })
    async findJobRoleById(@Param('id') id: string) {
        return await this.applicationsService.findJobRoleById(id);
    }

    // Seniority Levels endpoints
    @Post('seniority-levels')
    @ApiOperation({ summary: 'Create a new seniority level' })
    @ApiResponse({ status: 201, description: 'Seniority level created successfully' })
    async createSeniorityLevel(@Body() createSeniorityLevelDto: CreateSeniorityLevelDto) {
        const seniorityLevel = await this.applicationsService.createSeniorityLevel(createSeniorityLevelDto);
        // Emitir evento cuando se crea un nuevo nivel de seniority
        this.applicationClient.emit('seniority_level_created', {
            level: seniorityLevel,
            timestamp: new Date(),
        });
        return seniorityLevel;
    }

    @EventPattern('seniority_level_created')
    async handleSeniorityLevelCreated(data: any) {
        console.log('Nuevo nivel de seniority creado:', data);
        // Aquí puedes agregar lógica adicional para manejar el evento
    }

    @Get('seniority-levels')
    @ApiOperation({ summary: 'Get all seniority levels' })
    @ApiResponse({ status: 200, description: 'List of all seniority levels' })
    async findAllSeniorityLevels() {
        return await this.applicationsService.findAllSeniorityLevels();
    }

    @Get('seniority-levels/:id')
    @ApiOperation({ summary: 'Get a seniority level by ID' })
    @ApiResponse({ status: 200, description: 'Seniority level found' })
    @ApiResponse({ status: 404, description: 'Seniority level not found' })
    async findSeniorityLevelById(@Param('id') id: string) {
        return await this.applicationsService.findSeniorityLevelById(id);
    }

    // Applications endpoints
    @Post()
    @ApiOperation({ summary: 'Create a new application' })
    @ApiResponse({ status: 201, description: 'Application created successfully' })
    async createApplication(@Body() createApplicationDto: CreateApplicationDto) {
        // Verificar si el usuario existe
        const userExists = await firstValueFrom(
            this.applicationClient.send('verify_user', createApplicationDto.user_id)
        );

        // Verificar si la empresa existe
        const enterpriseExists = await firstValueFrom(
            this.applicationClient.send('verify_enterprise', createApplicationDto.enterprise_id)
        );

        if (!userExists) {
            throw new Error('Usuario no encontrado');
        }

        if (!enterpriseExists) {
            throw new Error('Empresa no encontrada');
        }

        const application = await this.applicationsService.createApplication(createApplicationDto);

        // Emitir evento cuando se crea una nueva aplicación
        this.applicationClient.emit('application_created', {
            application,
            timestamp: new Date(),
        });

        return application;
    }

    @EventPattern('application_created')
    async handleApplicationCreated(data: any) {
        console.log('Nueva aplicación creada:', data);
        // Aquí puedes agregar lógica adicional para manejar el evento
    }

    @Get()
    @ApiOperation({ summary: 'Get all applications' })
    @ApiResponse({ status: 200, description: 'List of all applications' })
    async findAllApplications() {
        return await this.applicationsService.findAllApplications();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an application by ID' })
    @ApiResponse({ status: 200, description: 'Application found' })
    @ApiResponse({ status: 404, description: 'Application not found' })
    async findApplicationById(@Param('id') id: string) {
        return await this.applicationsService.findApplicationById(id);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get applications by user ID' })
    @ApiResponse({ status: 200, description: 'List of applications for the user' })
    async findApplicationsByUserId(@Param('userId') userId: string) {
        // Verificar si el usuario existe antes de buscar sus aplicaciones
        const userExists = await firstValueFrom(
            this.applicationClient.send('verify_user', userId)
        );

        if (!userExists) {
            throw new Error('Usuario no encontrado');
        }

        return await this.applicationsService.findApplicationsByUserId(userId);
    }

    @Get('enterprise/:enterpriseId')
    @ApiOperation({ summary: 'Get applications by enterprise ID' })
    @ApiResponse({ status: 200, description: 'List of applications for the enterprise' })
    async findApplicationsByEnterpriseId(@Param('enterpriseId') enterpriseId: string) {
        // Verificar si la empresa existe antes de buscar sus aplicaciones
        const enterpriseExists = await firstValueFrom(
            this.applicationClient.send('verify_enterprise', enterpriseId)
        );

        if (!enterpriseExists) {
            throw new Error('Empresa no encontrada');
        }

        return await this.applicationsService.findApplicationsByEnterpriseId(enterpriseId);
    }

    // Manejadores de mensajes para verificación
    @MessagePattern('verify_application')
    async verifyApplication(applicationId: string) {
        try {
            const application = await this.applicationsService.findApplicationById(applicationId);
            return { exists: !!application };
        } catch (error) {
            return { exists: false };
        }
    }
}