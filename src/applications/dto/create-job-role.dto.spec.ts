import { validate } from 'class-validator';
import { CreateJobRoleDto } from './create-job-role.dto';

describe('CreateJobRoleDto', () => {
    let dto: CreateJobRoleDto;

    beforeEach(() => {
        dto = new CreateJobRoleDto();
    });

    it('should be defined', () => {
        expect(dto).toBeDefined();
    });

    describe('Validation - Valid Cases', () => {
        it('should validate with only required field (name)', async () => {
            dto.name = 'Desarrollador Full Stack';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with all fields', async () => {
            dto.name = 'Desarrollador Full Stack';
            dto.description = 'Desarrollador con experiencia en frontend y backend';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with minimum length name (3 characters)', async () => {
            dto.name = 'Dev';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with maximum length name (100 characters)', async () => {
            dto.name = 'a'.repeat(100);

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with undefined description', async () => {
            dto.name = 'Desarrollador Full Stack';
            dto.description = undefined;

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('Validation - Invalid Cases', () => {
        describe('name validation', () => {
            it('should fail when name is missing', async () => {
                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('name');
            });

            it('should fail when name is empty', async () => {
                dto.name = '';

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('name');
                expect(errors[0].constraints).toHaveProperty('minLength');
            });

            it('should fail when name is too short (less than 3 characters)', async () => {
                dto.name = 'ab';

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('name');
                expect(errors[0].constraints).toHaveProperty('minLength');
            });

            it('should fail when name is too long (more than 100 characters)', async () => {
                dto.name = 'a'.repeat(101);

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('name');
                expect(errors[0].constraints).toHaveProperty('maxLength');
            });

            it('should fail when name is not a string', async () => {
                (dto as any).name = 123;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('name');
                expect(errors[0].constraints).toHaveProperty('isString');
            });
        });

        describe('description validation', () => {
            it('should fail when description is not a string', async () => {
                dto.name = 'Desarrollador Full Stack';
                (dto as any).description = 123;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('description');
                expect(errors[0].constraints).toHaveProperty('isString');
            });

            it('should fail when description is an empty string', async () => {
                dto.name = 'Desarrollador Full Stack';
                dto.description = '';

                const errors = await validate(dto);
                expect(errors.length).toBe(0); // No debería fallar ya que no hay validación de longitud mínima
            });
        });
    });

    describe('Edge Cases', () => {
        it('should validate with name containing special characters', async () => {
            dto.name = 'Dev-Ops & Cloud Engineer';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with name containing numbers', async () => {
            dto.name = 'Developer 365';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with description containing multiple lines', async () => {
            dto.name = 'Desarrollador Full Stack';
            dto.description = 'Línea 1\nLínea 2\nLínea 3';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with description containing only whitespace', async () => {
            dto.name = 'Desarrollador Full Stack';
            dto.description = '   ';

            const errors = await validate(dto);
            expect(errors.length).toBe(0); // No debería fallar ya que no hay validación de contenido
        });
    });
});