import { Application } from './application.entity';
import { JobRole } from './job-role.entity';
import { SeniorityLevel } from './seniority-level.entity';

describe('Application Entity', () => {
    let application: Application;

    beforeEach(() => {
        application = new Application();
    });

    describe('Entity Structure', () => {
        it('should be defined', () => {
            expect(application).toBeDefined();
        });

        it('should be instance of Application', () => {
            expect(application).toBeInstanceOf(Application);
        });
    });

    describe('Property Assignment', () => {
        it('should assign and retrieve application_id', () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            application.application_id = id;
            expect(application.application_id).toBe(id);
        });

        it('should assign and retrieve user_id', () => {
            const userId = '123e4567-e89b-12d3-a456-426614174001';
            application.user_id = userId;
            expect(application.user_id).toBe(userId);
        });

        it('should assign and retrieve enterprise_id', () => {
            const enterpriseId = '123e4567-e89b-12d3-a456-426614174002';
            application.enterprise_id = enterpriseId;
            expect(application.enterprise_id).toBe(enterpriseId);
        });

        it('should assign and retrieve external_job_id', () => {
            const externalJobId = 'EXT-JOB-123';
            application.external_job_id = externalJobId;
            expect(application.external_job_id).toBe(externalJobId);
        });

        it('should assign and retrieve external_application_id', () => {
            const externalAppId = 'EXT-APP-123';
            application.external_application_id = externalAppId;
            expect(application.external_application_id).toBe(externalAppId);
        });

        it('should assign and retrieve created_at', () => {
            const date = new Date();
            application.created_at = date;
            expect(application.created_at).toBe(date);
        });
    });

    describe('Relationship Assignment', () => {
        it('should assign and retrieve job_role relationship', () => {
            const jobRole = new JobRole();
            jobRole.name = 'Developer';

            application.job_role = jobRole;
            expect(application.job_role).toBe(jobRole);
            expect(application.job_role.name).toBe('Developer');
        });

        it('should assign and retrieve seniority relationship', () => {
            const seniorityLevel = new SeniorityLevel();
            seniorityLevel.name = 'Senior';

            application.seniority = seniorityLevel;
            expect(application.seniority).toBe(seniorityLevel);
            expect(application.seniority.name).toBe('Senior');
        });
    });

    describe('Optional Fields', () => {
        it('should allow null for external_job_id', () => {
            application.external_job_id = null;
            expect(application.external_job_id).toBeNull();
        });

        it('should allow null for external_application_id', () => {
            application.external_application_id = null;
            expect(application.external_application_id).toBeNull();
        });
    });

    describe('Complete Entity', () => {
        it('should create a complete application with all properties', () => {
            const jobRole = new JobRole();
            const seniorityLevel = new SeniorityLevel();
            const date = new Date();

            const completeApplication = {
                application_id: '123e4567-e89b-12d3-a456-426614174000',
                user_id: '123e4567-e89b-12d3-a456-426614174001',
                enterprise_id: '123e4567-e89b-12d3-a456-426614174002',
                job_role: jobRole,
                seniority: seniorityLevel,
                external_job_id: 'EXT-JOB-123',
                external_application_id: 'EXT-APP-123',
                created_at: date
            };

            Object.assign(application, completeApplication);

            expect(application).toEqual(completeApplication);
        });
    });

    describe('Type Checking', () => {
        it('should have correct types for all properties', () => {
            const jobRole = new JobRole();
            const seniorityLevel = new SeniorityLevel();

            application.application_id = '123';
            application.user_id = '456';
            application.enterprise_id = '789';
            application.job_role = jobRole;
            application.seniority = seniorityLevel;
            application.external_job_id = 'ext-123';
            application.external_application_id = 'ext-456';
            application.created_at = new Date();

            expect(typeof application.application_id).toBe('string');
            expect(typeof application.user_id).toBe('string');
            expect(typeof application.enterprise_id).toBe('string');
            expect(application.job_role).toBeInstanceOf(JobRole);
            expect(application.seniority).toBeInstanceOf(SeniorityLevel);
            expect(typeof application.external_job_id).toBe('string');
            expect(typeof application.external_application_id).toBe('string');
            expect(application.created_at).toBeInstanceOf(Date);
        });
    });
});