import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('doctors')
export class Doctor {
  @ApiProperty({
    description: 'Unique identifier for the doctor',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Full name of the doctor',
    example: 'Dr. Jane Smith',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Medical specialization',
    example: 'Cardiology',
  })
  @Column({ length: 100 })
  specialization: string;

  @ApiProperty({
    description: 'Email address of the doctor',
    example: 'dr.jane.smith@hospital.com',
  })
  @Column({ unique: true, length: 255 })
  email: string;

  @ApiProperty({
    description: 'Phone number of the doctor',
    example: '+1234567890',
  })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({
    description: 'Years of experience',
    example: 15,
  })
  @Column()
  experience: number;

  @ApiProperty({
    description: 'License number',
    example: 'MD123456',
  })
  @Column({ unique: true, length: 50 })
  licenseNumber: string;

  @ApiProperty({
    description: 'Hospital or clinic affiliation',
    example: 'City General Hospital',
  })
  @Column({ length: 200 })
  hospital: string;

  @ApiProperty({
    description: 'Doctor biography',
    example: 'Experienced cardiologist with specialization in interventional cardiology.',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @Column({ nullable: true })
  profileImage: string;

  @ApiProperty({
    description: 'Consultation fee in USD',
    example: 150.00,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consultationFee: number;

  @ApiProperty({
    description: 'Available days of the week',
    example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  })
  @Column('simple-array')
  availableDays: string[];

  @ApiProperty({
    description: 'Start time for appointments',
    example: '09:00',
  })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({
    description: 'End time for appointments',
    example: '17:00',
  })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({
    description: 'Appointment duration in minutes',
    example: 30,
  })
  @Column({ default: 30 })
  appointmentDuration: number;

  @ApiProperty({
    description: 'Whether the doctor is currently active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @ApiProperty({
    description: 'Date when the doctor was registered',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the doctor information was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
