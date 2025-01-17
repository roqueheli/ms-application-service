import { Application } from './application.entity';
import { JobRole } from './job-role.entity';

describe('JobRole Entity', () => {
    let jobRole: JobRole;

    beforeEach(() => {
        jobRole = new JobRole();
    });

    describe('Entity Structure', () => {
        it('should be defined', () => {
            expect(jobRole).toBeDefined();
        });

        it('should be instance of JobRole', () => {
            expect(jobRole).toBeInstanceOf(JobRole);
        });
    });

    describe('Property Assignment', () => {
        it('should assign and retrieve job_role_id', () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            jobRole.job_role_id = id;
            expect(jobRole.job_role_id).toBe(id);
        });

        it('should assign and retrieve name', () => {
            const name = 'Full Stack Developer';
            jobRole.name = name;
            expect(jobRole.name).toBe(name);
        });

        it('should assign and retrieve description', () => {
            const description = 'Developer with experience in both frontend and backend';
            jobRole.description = description;
            expect(jobRole.description).toBe(description);
        });

        it('should assign and retrieve created_at', () => {
            const date = new Date();
            jobRole.created_at = date;
            expect(jobRole.created_at).toBe(date);
        });
    });

    describe('Relationship Assignment', () => {
        it('should initialize applications as empty array', () => {
            expect(jobRole.applications).toBeUndefined();
            jobRole.applications = [];
            expect(jobRole.applications).toEqual([]);
        });

        it('should assign and retrieve applications', () => {
            const application1 = new Application();
            const application2 = new Application();
            const applications = [application1, application2];

            jobRole.applications = applications;
            expect(jobRole.applications).toEqual(applications);
            expect(jobRole.applications.length).toBe(2);
        });

        it('should add application to applications array', () => {
            const application = new Application();
            jobRole.applications = [];
            jobRole.applications.push(application);

            expect(jobRole.applications).toContain(application);
            expect(jobRole.applications.length).toBe(1);
        });
    });

    describe('Optional Fields', () => {
        it('should allow null for description', () => {
            jobRole.description = null;
            expect(jobRole.description).toBeNull();
        });

        it('should allow undefined for description', () => {
            expect(jobRole.description).toBeUndefined();
        });
    });

    describe('Complete Entity', () => {
        it('should create a complete job role with all properties', () => {
            const date = new Date();
            const applications = [new Application(), new Application()];

            const completeJobRole = {
                job_role_id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Senior Developer',
                description: 'Experienced developer with leadership skills',
                created_at: date,
                applications: applications
            };

            Object.assign(jobRole, completeJobRole);

            expect(jobRole).toEqual(completeJobRole);
        });

        it('should create a minimal job role with only required properties', () => {
            const minimalJobRole = {
                job_role_id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Developer'
            };

            Object.assign(jobRole, minimalJobRole);

            expect(jobRole.job_role_id).toBe(minimalJobRole.job_role_id);
            expect(jobRole.name).toBe(minimalJobRole.name);
        });
    });

    describe('Type Checking', () => {
        it('should have correct types for all properties', () => {
            jobRole.job_role_id = '123';
            jobRole.name = 'Developer';
            jobRole.description = 'Description';
            jobRole.created_at = new Date();
            jobRole.applications = [new Application()];

            expect(typeof jobRole.job_role_id).toBe('string');
            expect(typeof jobRole.name).toBe('string');
            expect(typeof jobRole.description).toBe('string');
            expect(jobRole.created_at).toBeInstanceOf(Date);
            expect(Array.isArray(jobRole.applications)).toBe(true);
            expect(jobRole.applications[0]).toBeInstanceOf(Application);
        });
    });

    describe('Common Use Cases', () => {
        it('should handle common job role names', () => {
            const commonRoles = [
                'Software Engineer',
                'Frontend Developer',
                'Backend Developer',
                'Full Stack Developer',
                'DevOps Engineer',
                'Data Scientist',
                'Product Manager'
            ];

            for (const roleName of commonRoles) {
                jobRole.name = roleName;
                expect(jobRole.name).toBe(roleName);
            }
        });

        it('should handle multiline descriptions', () => {
            const multilineDescription = `
        Senior Developer position.
        Requirements:
        - 5+ years of experience
        - Strong leadership skills
        - Excellent communication
      `;

            jobRole.description = multilineDescription;
            expect(jobRole.description).toBe(multilineDescription);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string values', () => {
            jobRole.name = '';
            jobRole.description = '';

            expect(jobRole.name).toBe('');
            expect(jobRole.description).toBe('');
        });

        it('should handle special characters in strings', () => {
            const nameWithSpecialChars = 'Senior Developer (C++/C#)';
            const descriptionWithSpecialChars = 'Required: Java & Spring, Node.js @ v16+';

            jobRole.name = nameWithSpecialChars;
            jobRole.description = descriptionWithSpecialChars;

            expect(jobRole.name).toBe(nameWithSpecialChars);
            expect(jobRole.description).toBe(descriptionWithSpecialChars);
        });

        it('should handle very long strings', () => {
            const longName = 'a'.repeat(100);
            const longDescription = 'a'.repeat(1000);

            jobRole.name = longName;
            jobRole.description = longDescription;

            expect(jobRole.name).toBe(longName);
            expect(jobRole.description).toBe(longDescription);
        });
    });

    describe('Applications Relationship', () => {
        it('should maintain applications reference integrity', () => {
            const application = new Application();
            application.job_role = jobRole;

            jobRole.applications = [application];

            expect(jobRole.applications[0].job_role).toBe(jobRole);
        });

        it('should handle empty applications array', () => {
            jobRole.applications = [];
            expect(jobRole.applications).toEqual([]);
        });

        it('should handle multiple applications', () => {
            const applications = Array(5).fill(null).map(() => new Application());
            jobRole.applications = applications;

            expect(jobRole.applications.length).toBe(5);
            expect(jobRole.applications).toEqual(applications);
        });
    });
});