import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApplicationDto {
    @ApiProperty({
        description: 'ID del usuario que realiza la aplicación',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    user_id: string;

    @ApiProperty({
        description: 'ID de la empresa a la que se aplica',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsUUID()
    enterprise_id: string;

    @ApiProperty({
        description: 'ID del rol de trabajo',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsUUID()
    job_role_id: string;

    @ApiProperty({
        description: 'ID del nivel de seniority',
        example: '123e4567-e89b-12d3-a456-426614174003'
    })
    @IsUUID()
    seniority_id: string;

    @ApiProperty({
        description: 'ID del trabajo en el sistema externo',
        example: 'EXT-JOB-123',
        required: false
    })
    @IsString()
    @IsOptional()
    external_job_id?: string;

    @ApiProperty({
        description: 'ID de la aplicación en el sistema externo',
        example: 'EXT-APP-123',
        required: false
    })
    @IsString()
    @IsOptional()
    external_application_id?: string;
}