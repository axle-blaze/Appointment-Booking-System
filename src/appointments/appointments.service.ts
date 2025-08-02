import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';

import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    currentUser: User,
  ): Promise<Appointment> {
    // Validate doctor exists
    const doctor = await this.doctorsService.findById(createAppointmentDto.doctorId);
    
    // Validate appointment times
    const startTime = new Date(createAppointmentDto.startTime);
    const endTime = new Date(createAppointmentDto.endTime);
    
    this.validateAppointmentTimes(startTime, endTime);
    
    // Check for conflicts
    await this.checkForConflicts(createAppointmentDto.doctorId, startTime, endTime);
    
    // Validate appointment is within doctor's available hours
    await this.validateDoctorAvailability(doctor, startTime, endTime);

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      patientId: currentUser.id,
      startTime,
      endTime,
      consultationFee: doctor.consultationFee,
      status: AppointmentStatus.SCHEDULED,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['doctor', 'patient'],
      order: { startTime: 'ASC' },
    });
  }

  async findUserAppointments(userId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { patientId: userId },
      relations: ['doctor'],
      order: { startTime: 'ASC' },
    });
  }

  async findDoctorAppointments(
    doctorId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]> {
    const whereCondition: any = { doctorId };

    if (startDate && endDate) {
      whereCondition.startTime = Between(startDate, endDate);
    } else if (startDate) {
      whereCondition.startTime = MoreThan(startDate);
    } else if (endDate) {
      whereCondition.startTime = LessThan(endDate);
    }

    return this.appointmentsRepository.find({
      where: whereCondition,
      relations: ['patient'],
      order: { startTime: 'ASC' },
    });
  }

  async findById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    currentUser: User,
  ): Promise<Appointment> {
    const appointment = await this.findById(id);

    // Check permissions
    if (currentUser.role === UserRole.PATIENT && appointment.patientId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own appointments');
    }

    // Prevent updating past appointments
    if (appointment.startTime < new Date()) {
      throw new BadRequestException('Cannot update past appointments');
    }

    await this.appointmentsRepository.update(id, updateAppointmentDto);
    return this.findById(id);
  }

  async cancel(id: string, currentUser: User): Promise<Appointment> {
    const appointment = await this.findById(id);

    // Check permissions
    if (currentUser.role === UserRole.PATIENT && appointment.patientId !== currentUser.id) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }

    // Check if appointment can be cancelled
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed appointments');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    // Check cancellation policy (e.g., 24 hours before)
    const hoursUntilAppointment = (appointment.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursUntilAppointment < 24) {
      throw new BadRequestException('Appointments can only be cancelled at least 24 hours in advance');
    }

    await this.appointmentsRepository.update(id, {
      status: AppointmentStatus.CANCELLED,
    });

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findById(id);
    await this.appointmentsRepository.remove(appointment);
  }

  private validateAppointmentTimes(startTime: Date, endTime: Date): void {
    const now = new Date();
    
    if (startTime < now) {
      throw new BadRequestException('Cannot schedule appointments in the past');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Ensure appointment is not more than 6 months in advance
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setMonth(maxAdvanceDate.getMonth() + 6);
    
    if (startTime > maxAdvanceDate) {
      throw new BadRequestException('Cannot schedule appointments more than 6 months in advance');
    }

    // Ensure minimum appointment duration (15 minutes)
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (durationMinutes < 15) {
      throw new BadRequestException('Appointment must be at least 15 minutes long');
    }

    // Ensure maximum appointment duration (3 hours)
    if (durationMinutes > 180) {
      throw new BadRequestException('Appointment cannot be longer than 3 hours');
    }
  }

  private async checkForConflicts(
    doctorId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<void> {
    const queryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere('appointment.status NOT IN (:...statuses)', {
        statuses: [AppointmentStatus.CANCELLED],
      })
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeAppointmentId) {
      queryBuilder.andWhere('appointment.id != :excludeAppointmentId', {
        excludeAppointmentId,
      });
    }

    const conflictingAppointment = await queryBuilder.getOne();

    if (conflictingAppointment) {
      throw new ConflictException(
        'Doctor is not available at the selected time slot',
      );
    }
  }

  private async validateDoctorAvailability(
    doctor: any,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const dayName = startTime.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!doctor.availableDays.includes(dayName)) {
      throw new BadRequestException(`Doctor is not available on ${dayName}`);
    }

    const appointmentStartHour = startTime.getHours();
    const appointmentStartMinute = startTime.getMinutes();
    const appointmentEndHour = endTime.getHours();
    const appointmentEndMinute = endTime.getMinutes();

    const [doctorStartHour, doctorStartMinute] = doctor.startTime.split(':').map(Number);
    const [doctorEndHour, doctorEndMinute] = doctor.endTime.split(':').map(Number);

    const appointmentStartTotal = appointmentStartHour * 60 + appointmentStartMinute;
    const appointmentEndTotal = appointmentEndHour * 60 + appointmentEndMinute;
    const doctorStartTotal = doctorStartHour * 60 + doctorStartMinute;
    const doctorEndTotal = doctorEndHour * 60 + doctorEndMinute;

    if (appointmentStartTotal < doctorStartTotal || appointmentEndTotal > doctorEndTotal) {
      throw new BadRequestException(
        `Appointment must be within doctor's available hours (${doctor.startTime} - ${doctor.endTime})`,
      );
    }
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    const now = new Date();
    return this.appointmentsRepository.find({
      where: {
        patientId: userId,
        startTime: MoreThan(now),
        status: AppointmentStatus.SCHEDULED,
      },
      relations: ['doctor'],
      order: { startTime: 'ASC' },
      take: 10,
    });
  }

  async getDoctorSchedule(doctorId: string, date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.appointmentsRepository.find({
      where: {
        doctorId,
        startTime: Between(startOfDay, endOfDay),
        status: AppointmentStatus.SCHEDULED,
      },
      relations: ['patient'],
      order: { startTime: 'ASC' },
    });
  }
}
