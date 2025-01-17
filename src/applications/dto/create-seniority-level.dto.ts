import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSeniorityLevelDto {
    @ApiProperty({
        description: 'Nombre del nivel de seniority',
        example: 'Senior'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Descripción del nivel de seniority',
        example: 'Más de 5 años de experiencia',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;
}