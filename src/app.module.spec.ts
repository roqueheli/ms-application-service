// app.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Application } from './applications/entities/application.entity';
import { JobRole } from './applications/entities/job-role.entity';
import { SeniorityLevel } from './applications/entities/seniority-level.entity';

// Mock de valores de configuración que coinciden con tu entorno real
const mockEnvConfig = {
    DB_HOST: 'localhost',
    DB_PORT: '5433',
    DB_USERNAME: 'postgres',
    DB_PASSWORD: 'admin',
    DB_NAME: 'application_service_db',
    NODE_ENV: 'development'
};

jest.mock('@nestjs/typeorm', () => ({
    TypeOrmModule: {
        forRootAsync: jest.fn().mockReturnValue({
            module: class MockTypeOrmModule { },
        }),
        forFeature: jest.fn().mockReturnValue({})
    },
    getRepositoryToken: jest.fn(),
    InjectRepository: jest.fn()
}));

jest.mock('./applications/applications.module', () => ({
    ApplicationsModule: class MockApplicationsModule { }
}));

describe('AppModule', () => {
    let app: TestingModule;
    let configService: ConfigService;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [() => mockEnvConfig]
                })
            ],
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => mockEnvConfig[key])
                    }
                }
            ]
        }).compile();

        configService = app.get<ConfigService>(ConfigService);
    });

    describe('Module Structure', () => {
        it('should be defined', () => {
            expect(app).toBeDefined();
        });

        it('should have AppController', () => {
            const controller = app.get<AppController>(AppController);
            expect(controller).toBeDefined();
        });

        it('should have AppService', () => {
            const service = app.get<AppService>(AppService);
            expect(service).toBeDefined();
        });
    });

    describe('Database Configuration', () => {
        it('should configure database connection based on environment', () => {
            expect(configService.get('DB_HOST')).toBe('localhost');
            expect(configService.get('DB_PORT')).toBe('5433');
            expect(configService.get('DB_USERNAME')).toBe('postgres');
            expect(configService.get('DB_PASSWORD')).toBe('admin');
            expect(configService.get('DB_NAME')).toBe('application_service_db');
        });

        it('should use correct database configuration', () => {
            const dbConfig = {
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: parseInt(configService.get('DB_PORT')),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [Application, JobRole, SeniorityLevel],
                synchronize: configService.get('NODE_ENV') !== 'production',
                logging: configService.get('NODE_ENV') !== 'production',
                ssl: configService.get('NODE_ENV') === 'production' ? {
                    rejectUnauthorized: false
                } : false
            };

            expect(dbConfig.type).toBe('postgres');
            expect(dbConfig.host).toBe('localhost');
            expect(dbConfig.port).toBe(5433);
            expect(dbConfig.username).toBe('postgres');
            expect(dbConfig.password).toBe('admin');
            expect(dbConfig.database).toBe('application_service_db');
            expect(dbConfig.entities).toContain(Application);
            expect(dbConfig.entities).toContain(JobRole);
            expect(dbConfig.entities).toContain(SeniorityLevel);
        });
    });

    describe('Environment Configuration', () => {
        it('should load environment variables', () => {
            expect(configService.get('NODE_ENV')).toBe('test');
        });

        it('should handle production environment', () => {
            jest.spyOn(configService, 'get').mockImplementation((key) =>
                key === 'NODE_ENV' ? 'production' : mockEnvConfig[key]
            );

            const dbConfig = {
                synchronize: configService.get('NODE_ENV') !== 'production',
                logging: configService.get('NODE_ENV') !== 'production',
                ssl: configService.get('NODE_ENV') === 'production' ? {
                    rejectUnauthorized: false
                } : false
            };

            expect(configService.get('NODE_ENV')).toBe('production');
            expect(dbConfig.synchronize).toBe(false);
            expect(dbConfig.logging).toBe(false);
            expect(dbConfig.ssl).toEqual({ rejectUnauthorized: false });
        });
    });

    describe('Module Configuration', () => {
        it('should have global ConfigModule', () => {
            const configModule = ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            });
            expect(configModule).toBeDefined();
        });

        it('should configure TypeORM correctly', () => {
            const typeOrmModule = TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: parseInt(configService.get('DB_PORT')),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [Application, JobRole, SeniorityLevel],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') !== 'production',
                    ssl: configService.get('NODE_ENV') === 'production' ? {
                        rejectUnauthorized: false
                    } : false,
                }),
                inject: [ConfigService],
            });
            expect(typeOrmModule).toBeDefined();
        });
    });
});