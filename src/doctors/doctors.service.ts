import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

export interface DoctorQueryDto {
  specialization?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existingDoctor = await this.doctorsRepository.findOne({
      where: [
        { email: createDoctorDto.email },
        { licenseNumber: createDoctorDto.licenseNumber },
      ],
    });

    if (existingDoctor) {
      if (existingDoctor.email === createDoctorDto.email) {
        throw new ConflictException('Doctor with this email already exists');
      }
      if (existingDoctor.licenseNumber === createDoctorDto.licenseNumber) {
        throw new ConflictException('Doctor with this license number already exists');
      }
    }

    // Validate time format and logic
    this.validateTimeRange(createDoctorDto.startTime, createDoctorDto.endTime);

    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async findAll(query: DoctorQueryDto = {}): Promise<{
    doctors: Doctor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { specialization, page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.doctorsRepository
      .createQueryBuilder('doctor')
      .where('doctor.isActive = :isActive', { isActive: true });

    if (specialization) {
      queryBuilder.andWhere('doctor.specialization ILIKE :specialization', {
        specialization: `%${specialization}%`,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(doctor.name ILIKE :search OR doctor.specialization ILIKE :search OR doctor.hospital ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('doctor.name', 'ASC')
      .skip(skip)
      .take(limit);

    const [doctors, total] = await queryBuilder.getManyAndCount();

    return {
      doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id, isActive: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async getAvailableSlots(
    doctorId: string,
    date: string,
  ): Promise<AvailableSlot[]> {
    const doctor = await this.findById(doctorId);
    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if doctor is available on this day
    if (!doctor.availableDays.includes(dayName)) {
      return [];
    }

    // Generate time slots
    const slots: AvailableSlot[] = [];
    const startTime = this.parseTime(doctor.startTime);
    const endTime = this.parseTime(doctor.endTime);
    const duration = doctor.appointmentDuration;

    let current = new Date(requestedDate);
    current.setHours(startTime.hours, startTime.minutes, 0, 0);

    const end = new Date(requestedDate);
    end.setHours(endTime.hours, endTime.minutes, 0, 0);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + duration * 60000);

      if (slotEnd <= end) {
        // Check if slot is available (not booked)
        const isBooked = await this.isSlotBooked();
        
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          available: !isBooked,
        });
      }

      current = slotEnd;
    }

    return slots;
  }

  async update(id: string, updateData: Partial<CreateDoctorDto>): Promise<Doctor> {
    const doctor = await this.findById(id);

    if (updateData.email && updateData.email !== doctor.email) {
      const existingDoctor = await this.doctorsRepository.findOne({
        where: { email: updateData.email },
      });
      if (existingDoctor) {
        throw new ConflictException('Doctor with this email already exists');
      }
    }

    if (updateData.licenseNumber && updateData.licenseNumber !== doctor.licenseNumber) {
      const existingDoctor = await this.doctorsRepository.findOne({
        where: { licenseNumber: updateData.licenseNumber },
      });
      if (existingDoctor) {
        throw new ConflictException('Doctor with this license number already exists');
      }
    }

    if (updateData.startTime && updateData.endTime) {
      this.validateTimeRange(updateData.startTime, updateData.endTime);
    }

    await this.doctorsRepository.update(id, updateData);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.doctorsRepository.update(id, { isActive: false });
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);

    if (start.hours > end.hours || (start.hours === end.hours && start.minutes >= end.minutes)) {
      throw new BadRequestException('Start time must be before end time');
    }
  }

  private parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  private async isSlotBooked(): Promise<boolean> {
    // This would typically query the appointments table
    // For now, returning false to indicate all slots are available
    // This will be implemented when we create the appointments service
    return false;
  }

  async getSpecializations(): Promise<string[]> {
    const result = await this.doctorsRepository
      .createQueryBuilder('doctor')
      .select('DISTINCT doctor.specialization', 'specialization')
      .where('doctor.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result.map(row => row.specialization);
  }
}
