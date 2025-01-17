-- Crear la base de datos
CREATE DATABASE application_service_db;
-- Usar la base de datos
\ c application_service_db;
-- Crear la tabla de roles de trabajo
CREATE TABLE job_roles (
    job_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Crear la tabla de niveles de seniority
CREATE TABLE seniority_levels (
    seniority_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Crear la tabla de aplicaciones
CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    enterprise_id UUID NOT NULL,
    job_role_id UUID NOT NULL,
    seniority_id UUID NOT NULL,
    external_job_id VARCHAR(100),
    external_application_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(job_role_id),
    FOREIGN KEY (seniority_id) REFERENCES seniority_levels(seniority_id)
);