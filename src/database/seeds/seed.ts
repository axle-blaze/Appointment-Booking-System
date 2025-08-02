import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

export async function seed(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const doctorRepository = dataSource.getRepository(Doctor);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = userRepository.create({
    name: 'System Administrator',
    email: 'admin@hospital.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    phone: '+1234567890',
  });
  await userRepository.save(admin);

  // Create patient users
  const patientPassword = await bcrypt.hash('patient123', 12);
  const patients = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: patientPassword,
      role: UserRole.PATIENT,
      phone: '+1234567891',
      dateOfBirth: new Date('1990-01-15'),
      address: '123 Main St, City, State, 12345',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: patientPassword,
      role: UserRole.PATIENT,
      phone: '+1234567892',
      dateOfBirth: new Date('1985-06-20'),
      address: '456 Oak Ave, City, State, 67890',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      password: patientPassword,
      role: UserRole.PATIENT,
      phone: '+1234567893',
      dateOfBirth: new Date('1978-11-03'),
      address: '789 Pine Rd, City, State, 54321',
    },
  ];

  for (const patientData of patients) {
    const patient = userRepository.create(patientData);
    await userRepository.save(patient);
  }

  // Create doctors
  const doctors = [
    {
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology',
      email: 'dr.sarah.wilson@hospital.com',
      phone: '+1234567800',
      experience: 15,
      licenseNumber: 'MD001234',
      hospital: 'City General Hospital',
      bio: 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention.',
      consultationFee: 200.00,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '17:00',
      appointmentDuration: 30,
      isActive: true,
    },
    {
      name: 'Dr. Michael Brown',
      specialization: 'Neurology',
      email: 'dr.michael.brown@hospital.com',
      phone: '+1234567801',
      experience: 12,
      licenseNumber: 'MD001235',
      hospital: 'City General Hospital',
      bio: 'Neurologist with expertise in treating neurological disorders and brain injuries.',
      consultationFee: 180.00,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      startTime: '08:00',
      endTime: '16:00',
      appointmentDuration: 45,
      isActive: true,
    },
    {
      name: 'Dr. Emily Davis',
      specialization: 'Pediatrics',
      email: 'dr.emily.davis@hospital.com',
      phone: '+1234567802',
      experience: 8,
      licenseNumber: 'MD001236',
      hospital: 'Children\'s Medical Center',
      bio: 'Pediatrician dedicated to providing comprehensive healthcare for children and adolescents.',
      consultationFee: 150.00,
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      startTime: '10:00',
      endTime: '18:00',
      appointmentDuration: 30,
      isActive: true,
    },
    {
      name: 'Dr. Robert Garcia',
      specialization: 'Orthopedics',
      email: 'dr.robert.garcia@hospital.com',
      phone: '+1234567803',
      experience: 20,
      licenseNumber: 'MD001237',
      hospital: 'Sports Medicine Center',
      bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
      consultationFee: 220.00,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      startTime: '07:00',
      endTime: '15:00',
      appointmentDuration: 45,
      isActive: true,
    },
    {
      name: 'Dr. Lisa Martinez',
      specialization: 'Dermatology',
      email: 'dr.lisa.martinez@hospital.com',
      phone: '+1234567804',
      experience: 10,
      licenseNumber: 'MD001238',
      hospital: 'Skin Care Clinic',
      bio: 'Dermatologist with expertise in medical and cosmetic dermatology.',
      consultationFee: 175.00,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:30',
      endTime: '17:30',
      appointmentDuration: 30,
      isActive: true,
    },
    {
      name: 'Dr. David Lee',
      specialization: 'Psychiatry',
      email: 'dr.david.lee@hospital.com',
      phone: '+1234567805',
      experience: 14,
      licenseNumber: 'MD001239',
      hospital: 'Mental Health Center',
      bio: 'Psychiatrist specializing in anxiety, depression, and behavioral disorders.',
      consultationFee: 190.00,
      availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '11:00',
      endTime: '19:00',
      appointmentDuration: 60,
      isActive: true,
    },
  ];

  for (const doctorData of doctors) {
    const doctor = doctorRepository.create(doctorData);
    await doctorRepository.save(doctor);
  }

  console.log('✅ Database seeded successfully!');
  console.log('👨‍⚕️ Created doctors:', doctors.length);
  console.log('👥 Created users:', patients.length + 1);
  console.log('\n📧 Admin credentials:');
  console.log('Email: admin@hospital.com');
  console.log('Password: admin123');
  console.log('\n📧 Patient credentials:');
  console.log('Email: john.doe@example.com');
  console.log('Password: patient123');
}

// Standalone script execution
if (require.main === module) {
  // Note: For seeding, you'll need to configure the database connection manually
  console.log('To seed the database, use: npm run seed');
}
