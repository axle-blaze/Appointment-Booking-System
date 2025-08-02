import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment booked successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 409,
    description: 'Doctor is not available at the selected time slot',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid appointment data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all appointments (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user appointments' })
  @ApiResponse({
    status: 200,
    description: 'User appointments retrieved successfully',
  })
  async findMyAppointments(@Request() req): Promise<Appointment[]> {
    return this.appointmentsService.findUserAppointments(req.user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming appointments for current user' })
  @ApiResponse({
    status: 200,
    description: 'Upcoming appointments retrieved successfully',
  })
  async getUpcoming(@Request() req): Promise<Appointment[]> {
    return this.appointmentsService.getUpcomingAppointments(req.user.id);
  }

  @Get('doctor/:doctorId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get appointments for a specific doctor (Admin only)' })
  @ApiParam({ name: 'doctorId', description: 'Doctor UUID' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date filter (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date filter (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor appointments retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findDoctorAppointments(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Appointment[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.appointmentsService.findDoctorAppointments(doctorId, start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment retrieved successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment> {
    return this.appointmentsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only update your own appointments',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, updateAppointmentDto, req.user);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment cancelled successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only cancel your own appointments',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel this appointment',
  })
  async cancel(@Param('id', ParseUUIDPipe) id: string, @Request() req): Promise<Appointment> {
    return this.appointmentsService.cancel(id, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete appointment (Admin only)' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.appointmentsService.remove(id);
  }
}
