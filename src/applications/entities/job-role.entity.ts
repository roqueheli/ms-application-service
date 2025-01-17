import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from './application.entity';

@Entity('job_roles')
export class JobRole {
    @PrimaryGeneratedColumn('uuid')
    job_role_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Application, (application) => application.job_role)
    applications: Application[];
}