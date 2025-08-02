import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Doctor ID for the appointment',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: 'Start time of the appointment',
    example: '2024-08-15T10:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the appointment',
    example: '2024-08-15T10:30:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Reason for the appointment',
    example: 'Regular checkup',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Symptoms reported by patient',
    example: 'Chest pain, shortness of breath',
    required: false,
  })
  @IsOptional()
  @IsString()
  symptoms?: string;
}

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Notes from the doctor',
    example: 'Patient is in good health',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Reason for the appointment',
    example: 'Follow-up consultation',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Symptoms reported by patient',
    example: 'Feeling better after medication',
    required: false,
  })
  @IsOptional()
  @IsString()
  symptoms?: string;
}
