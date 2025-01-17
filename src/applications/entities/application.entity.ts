import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobRole } from './job-role.entity';
import { SeniorityLevel } from './seniority-level.entity';

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn('uuid')
    application_id: string;

    @Column()
    user_id: string;

    @Column()
    enterprise_id: string;

    @ManyToOne(() => JobRole, (jobRole) => jobRole.applications)
    job_role: JobRole;

    @ManyToOne(() => SeniorityLevel, (seniorityLevel) => seniorityLevel.applications)
    seniority: SeniorityLevel;

    @Column({ nullable: true })
    external_job_id: string;

    @Column({ nullable: true })
    external_application_id: string;

    @CreateDateColumn()
    created_at: Date;
}