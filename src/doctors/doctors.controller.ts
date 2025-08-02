import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { DoctorsService, DoctorQueryDto, AvailableSlot } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new doctor (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Doctor created successfully',
    type: Doctor,
  })
  @ApiResponse({
    status: 409,
    description: 'Doctor with email or license number already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all doctors with filtering and pagination' })
  @ApiQuery({
    name: 'specialization',
    required: false,
    description: 'Filter by specialization',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, specialization, or hospital',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctors retrieved successfully',
  })
  async findAll(@Query() query: DoctorQueryDto) {
    return this.doctorsService.findAll(query);
  }

  @Get('specializations')
  @ApiOperation({ summary: 'Get all unique specializations' })
  @ApiResponse({
    status: 200,
    description: 'Specializations retrieved successfully',
  })
  async getSpecializations(): Promise<string[]> {
    return this.doctorsService.getSpecializations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  @ApiParam({ name: 'id', description: 'Doctor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Doctor retrieved successfully',
    type: Doctor,
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Doctor> {
    return this.doctorsService.findById(id);
  }

  @Get(':id/available-slots')
  @ApiOperation({ summary: 'Get available time slots for a doctor on a specific date' })
  @ApiParam({ name: 'id', description: 'Doctor UUID' })
  @ApiQuery({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2024-08-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Available slots retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format',
  })
  async getAvailableSlots(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('date') date: string,
  ): Promise<AvailableSlot[]> {
    return this.doctorsService.getAvailableSlots(id, date);
  }
}
