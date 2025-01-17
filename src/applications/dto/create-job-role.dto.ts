import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateJobRoleDto {
    @ApiProperty({
        description: 'Nombre del rol de trabajo',
        example: 'Desarrollador Full Stack'
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Descripción del rol de trabajo',
        example: 'Desarrollador con experiencia en frontend y backend',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;
}