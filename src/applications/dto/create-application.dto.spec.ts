import { validate } from 'class-validator';
import { CreateApplicationDto } from './create-application.dto';

describe('CreateApplicationDto', () => {
    let dto: CreateApplicationDto;

    // UUID válido para usar en las pruebas
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';

    beforeEach(() => {
        dto = new CreateApplicationDto();
    });

    it('should be defined', () => {
        expect(dto).toBeDefined();
    });

    describe('Validation - Valid Cases', () => {
        it('should validate with all required fields', async () => {
            dto.user_id = validUUID;
            dto.enterprise_id = validUUID;
            dto.job_role_id = validUUID;
            dto.seniority_id = validUUID;

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with all fields including optional ones', async () => {
            dto.user_id = validUUID;
            dto.enterprise_id = validUUID;
            dto.job_role_id = validUUID;
            dto.seniority_id = validUUID;
            dto.external_job_id = 'EXT-JOB-123';
            dto.external_application_id = 'EXT-APP-123';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate without optional fields', async () => {
            dto.user_id = validUUID;
            dto.enterprise_id = validUUID;
            dto.job_role_id = validUUID;
            dto.seniority_id = validUUID;
            dto.external_job_id = undefined;
            dto.external_application_id = undefined;

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('Validation - Invalid Cases', () => {
        describe('user_id validation', () => {
            it('should fail when user_id is missing', async () => {
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('user_id');
            });

            it('should fail when user_id is not a valid UUID', async () => {
                dto.user_id = 'invalid-uuid';
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('user_id');
                expect(errors[0].constraints).toHaveProperty('isUuid');
            });
        });

        describe('enterprise_id validation', () => {
            it('should fail when enterprise_id is missing', async () => {
                dto.user_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('enterprise_id');
            });

            it('should fail when enterprise_id is not a valid UUID', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = 'invalid-uuid';
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('enterprise_id');
                expect(errors[0].constraints).toHaveProperty('isUuid');
            });
        });

        describe('job_role_id validation', () => {
            it('should fail when job_role_id is missing', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.seniority_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('job_role_id');
            });

            it('should fail when job_role_id is not a valid UUID', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = 'invalid-uuid';
                dto.seniority_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('job_role_id');
                expect(errors[0].constraints).toHaveProperty('isUuid');
            });
        });

        describe('seniority_id validation', () => {
            it('should fail when seniority_id is missing', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('seniority_id');
            });

            it('should fail when seniority_id is not a valid UUID', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = 'invalid-uuid';

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('seniority_id');
                expect(errors[0].constraints).toHaveProperty('isUuid');
            });
        });

        describe('Optional fields validation', () => {
            it('should validate when external_job_id is a valid string', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;
                dto.external_job_id = 'valid-string';

                const errors = await validate(dto);
                expect(errors.length).toBe(0);
            });

            it('should validate when external_application_id is a valid string', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;
                dto.external_application_id = 'valid-string';

                const errors = await validate(dto);
                expect(errors.length).toBe(0);
            });

            it('should fail when external_job_id is not a string', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;
                (dto as any).external_job_id = 123;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('external_job_id');
                expect(errors[0].constraints).toHaveProperty('isString');
            });

            it('should fail when external_application_id is not a string', async () => {
                dto.user_id = validUUID;
                dto.enterprise_id = validUUID;
                dto.job_role_id = validUUID;
                dto.seniority_id = validUUID;
                (dto as any).external_application_id = 123;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('external_application_id');
                expect(errors[0].constraints).toHaveProperty('isString');
            });
        });
    });
});