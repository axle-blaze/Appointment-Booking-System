import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum UserRole {
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.PATIENT,
  })
  @Column({
    type: 'varchar',
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @Column({ length: 20, nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, State, 12345',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @ApiProperty({
    description: 'Date when the user was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
