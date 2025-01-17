import { validate } from 'class-validator';
import { CreateSeniorityLevelDto } from './create-seniority-level.dto';

describe('CreateSeniorityLevelDto', () => {
    let dto: CreateSeniorityLevelDto;

    beforeEach(() => {
        dto = new CreateSeniorityLevelDto();
    });

    it('should be defined', () => {
        expect(dto).toBeDefined();
    });

    describe('Validation - Valid Cases', () => {
        it('should validate with only required field (name)', async () => {
            dto.name = 'Senior';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with all fields', async () => {
            dto.name = 'Senior';
            dto.description = 'Más de 5 años de experiencia';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with minimum length name (2 characters)', async () => {
            dto.name = 'Sr';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with maximum length name (50 characters)', async () => {
            dto.name = 'a'.repeat(50);

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with undefined description', async () => {
            dto.name = 'Senior';
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

            it('should fail when name is too short (less than 2 characters)', async () => {
                dto.name = 'a';

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('name');
                expect(errors[0].constraints).toHaveProperty('minLength');
            });

            it('should fail when name is too long (more than 50 characters)', async () => {
                dto.name = 'a'.repeat(51);

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
                dto.name = 'Senior';
                (dto as any).description = 123;

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0].property).toBe('description');
                expect(errors[0].constraints).toHaveProperty('isString');
            });

            it('should validate when description is an empty string', async () => {
                dto.name = 'Senior';
                dto.description = '';

                const errors = await validate(dto);
                expect(errors.length).toBe(0); // No debería fallar ya que no hay validación de longitud mínima
            });
        });
    });

    describe('Edge Cases', () => {
        it('should validate with name containing special characters', async () => {
            dto.name = 'Sr. Tech Lead';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with name containing numbers', async () => {
            dto.name = 'Level 3';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with description containing multiple lines', async () => {
            dto.name = 'Senior';
            dto.description = 'Línea 1\nLínea 2\nLínea 3';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with description containing only whitespace', async () => {
            dto.name = 'Senior';
            dto.description = '   ';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with name containing whitespace at edges', async () => {
            dto.name = '  Senior Developer  ';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate with common seniority level names', async () => {
            const commonNames = [
                'Junior',
                'Mid-Level',
                'Senior',
                'Lead',
                'Principal',
                'Staff',
                'Distinguished'
            ];

            for (const name of commonNames) {
                dto.name = name;
                const errors = await validate(dto);
                expect(errors.length).toBe(0);
            }
        });
    });

    describe('Common Use Cases', () => {
        it('should validate typical seniority level with description', async () => {
            const testCases = [
                {
                    name: 'Junior',
                    description: '0-2 años de experiencia'
                },
                {
                    name: 'Mid-Level',
                    description: '2-5 años de experiencia'
                },
                {
                    name: 'Senior',
                    description: '5+ años de experiencia'
                }
            ];

            for (const testCase of testCases) {
                dto.name = testCase.name;
                dto.description = testCase.description;
                const errors = await validate(dto);
                expect(errors.length).toBe(0);
            }
        });

        it('should validate international seniority names', async () => {
            const internationalNames = [
                'Trainee',
                'Associate',
                'Expert',
                'Specialist',
                'Master'
            ];

            for (const name of internationalNames) {
                dto.name = name;
                const errors = await validate(dto);
                expect(errors.length).toBe(0);
            }
        });
    });
});