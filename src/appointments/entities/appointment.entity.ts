import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

@Entity('appointments')
export class Appointment {
  @ApiProperty({
    description: 'Unique identifier for the appointment',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Doctor ID for the appointment',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @Column()
  doctorId: string;

  @ApiProperty({
    description: 'Patient ID for the appointment',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @Column()
  patientId: string;

  @ApiProperty({
    description: 'Start time of the appointment',
    example: '2024-08-15T10:00:00Z',
  })
  @Column({ type: 'timestamp' })
  startTime: Date;

  @ApiProperty({
    description: 'End time of the appointment',
    example: '2024-08-15T10:30:00Z',
  })
  @Column({ type: 'timestamp' })
  endTime: Date;

  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @Column({
    type: 'varchar',
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @ApiProperty({
    description: 'Reason for the appointment',
    example: 'Regular checkup',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  reason: string;

  @ApiProperty({
    description: 'Notes from the doctor',
    example: 'Patient is in good health',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Symptoms reported by patient',
    example: 'Chest pain, shortness of breath',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @ApiProperty({
    description: 'Consultation fee for this appointment',
    example: 150.00,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consultationFee: number;

  @ApiProperty({
    description: 'Whether the patient has arrived',
    example: false,
  })
  @Column({ default: false })
  patientArrived: boolean;

  @ApiProperty({
    description: 'Reminder sent status',
    example: false,
  })
  @Column({ default: false })
  reminderSent: boolean;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToOne(() => User, (user) => user.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @ApiProperty({
    description: 'Date when the appointment was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the appointment was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
