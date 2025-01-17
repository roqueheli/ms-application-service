import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from './application.entity';

@Entity('seniority_levels')
export class SeniorityLevel {
    @PrimaryGeneratedColumn('uuid')
    seniority_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Application, (application) => application.seniority)
    applications: Application[];
}