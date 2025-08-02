import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsArray, IsOptional, IsBoolean, Matches, Min, Max } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'Full name of the doctor',
    example: 'Dr. Jane Smith',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Medical specialization',
    example: 'Cardiology',
  })
  @IsString()
  specialization: string;

  @ApiProperty({
    description: 'Email address of the doctor',
    example: 'dr.jane.smith@hospital.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the doctor',
    example: '+1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Years of experience',
    example: 15,
  })
  @IsNumber()
  @Min(0)
  @Max(50)
  experience: number;

  @ApiProperty({
    description: 'License number',
    example: 'MD123456',
  })
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    description: 'Hospital or clinic affiliation',
    example: 'City General Hospital',
  })
  @IsString()
  hospital: string;

  @ApiProperty({
    description: 'Doctor biography',
    example: 'Experienced cardiologist with specialization in interventional cardiology.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    description: 'Consultation fee in USD',
    example: 150.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  consultationFee: number;

  @ApiProperty({
    description: 'Available days of the week',
    example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  })
  @IsArray()
  @IsString({ each: true })
  availableDays: string[];

  @ApiProperty({
    description: 'Start time for appointments (HH:MM format)',
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time for appointments (HH:MM format)',
    example: '17:00',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;

  @ApiProperty({
    description: 'Appointment duration in minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(180)
  appointmentDuration?: number;

  @ApiProperty({
    description: 'Whether the doctor is currently active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
