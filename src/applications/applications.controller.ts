import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateSeniorityLevelDto } from './dto/create-seniority-level.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) { }

    // Job Roles endpoints
    @Post('job-roles')
    @ApiOperation({ summary: 'Create a new job role' })
    @ApiResponse({ status: 201, description: 'Job role created successfully' })
    async createJobRole(@Body() createJobRoleDto: CreateJobRoleDto) {
        return await this.applicationsService.createJobRole(createJobRoleDto);
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
        return await this.applicationsService.createSeniorityLevel(createSeniorityLevelDto);
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
        return await this.applicationsService.createApplication(createApplicationDto);
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
        return await this.applicationsService.findApplicationsByUserId(userId);
    }

    @Get('enterprise/:enterpriseId')
    @ApiOperation({ summary: 'Get applications by enterprise ID' })
    @ApiResponse({ status: 200, description: 'List of applications for the enterprise' })
    async findApplicationsByEnterpriseId(@Param('enterpriseId') enterpriseId: string) {
        return await this.applicationsService.findApplicationsByEnterpriseId(enterpriseId);
    }
}