# Doctor Appointment Booking System

A production-grade backend system built with NestJS for managing doctor appointments, featuring authentication, authorization, and comprehensive API documentation.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **Doctor Management**: CRUD operations for doctors with specialization filtering
- **Appointment Booking**: Comprehensive appointment system with conflict detection
- **User Management**: Patient and admin user management
- **API Documentation**: Auto-generated Swagger documentation
- **Production Ready**: Rate limiting, logging, validation, error handling
- **Database**: PostgreSQL with TypeORM
- **Security**: Helmet, CORS, input validation, password hashing

## 🛠️ Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js with JWT
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, Rate limiting
- **Logging**: Winston

## 📋 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- *(Optional)* PostgreSQL (v13+ recommended) - for production use

**Note**: SQLite is used by default for development - no additional database setup required!

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doctor-appointment-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=doctor_appointment
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Database Setup**
   
   Create the database:
   ```sql
   CREATE DATABASE doctor_appointment;
   ```

5. **Run migrations and seed data**
   ```bash
   npm run migration:run
   npm run seed
   ```

## 🚦 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Watch Mode (Auto-restart on changes)
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`

## 🌟 Quick Start

After installation, to quickly start the development server:

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run start:dev
```

The server will start at `http://localhost:3000` and automatically reload when you make changes to the code.

✅ **Server Status**: Currently running successfully with SQLite database!

## 🗄️ Database Configuration

The application is currently configured to use **SQLite** for easy development setup (no external database required):

- **Database Type**: SQLite
- **Database File**: `data/doctor_appointment.db`
- **Auto-created**: Tables are automatically created on first run

### Switching to PostgreSQL (Production)

To use PostgreSQL (recommended for production), update `src/database/database.module.ts`:

```typescript
// Change from:
type: 'sqlite',
database: 'data/doctor_appointment.db',

// To:
type: 'postgres',
host: configService.get<string>('DATABASE_HOST'),
port: configService.get<number>('DATABASE_PORT'),
username: configService.get<string>('DATABASE_USERNAME'),
password: configService.get<string>('DATABASE_PASSWORD'),
database: configService.get<string>('DATABASE_NAME'),
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api/v1

## 🔐 Authentication

### Default Credentials

**Admin User:**
- Email: `admin@hospital.com`
- Password: `admin123`

**Patient User:**
- Email: `john.doe@example.com`
- Password: `patient123`

### API Authentication

1. **Register/Login** to get a JWT token
2. **Include the token** in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## 📖 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Doctors
- `GET /api/v1/doctors` - List doctors (with pagination & filtering)
- `GET /api/v1/doctors/:id` - Get doctor details
- `GET /api/v1/doctors/:id/available-slots?date=YYYY-MM-DD` - Get available slots
- `GET /api/v1/doctors/specializations` - Get all specializations
- `POST /api/v1/doctors` - Create doctor (Admin only)

### Appointments
- `POST /api/v1/appointments` - Book appointment (Auth required)
- `GET /api/v1/appointments/my` - Get user's appointments
- `GET /api/v1/appointments/upcoming` - Get upcoming appointments
- `PATCH /api/v1/appointments/:id` - Update appointment
- `POST /api/v1/appointments/:id/cancel` - Cancel appointment
- `GET /api/v1/appointments` - Get all appointments (Admin only)

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users` - Get all users (Admin only)

## 🏗️ Architecture

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # User management
├── doctors/             # Doctor management
├── appointments/        # Appointment management
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── guards/          # Route guards
│   └── interceptors/    # Response interceptors
├── database/            # Database configuration
│   ├── migrations/      # Database migrations
│   └── seeds/           # Seed data
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against brute force
- **Input Validation**: Comprehensive data validation
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Role-based Access**: Admin/Patient permissions

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: PATIENT, ADMIN)
- `phone`, `dateOfBirth`, `address` (Optional)

### Doctors Table
- `id` (UUID, Primary Key)
- `name`, `specialization`, `email` (String)
- `experience` (Number)
- `licenseNumber` (String, Unique)
- `hospital`, `bio` (String)
- `consultationFee` (Decimal)
- `availableDays` (Array)
- `startTime`, `endTime` (Time)
- `appointmentDuration` (Number)

### Appointments Table
- `id` (UUID, Primary Key)
- `doctorId`, `patientId` (UUID, Foreign Keys)
- `startTime`, `endTime` (Timestamp)
- `status` (Enum: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
- `reason`, `notes`, `symptoms` (Optional Text)
- `consultationFee` (Decimal)

## 🧪 Business Rules

- **No Double Booking**: Doctors cannot have overlapping appointments
- **Time Validation**: Start time must be before end time
- **Future Appointments**: Cannot schedule in the past
- **Doctor Availability**: Appointments must be within doctor's working hours
- **Cancellation Policy**: 24-hour advance cancellation required
- **Appointment Duration**: 15 minutes minimum, 3 hours maximum

## 🔧 Development Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
npm run seed              # Seed database

# Testing
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Test coverage

# Code Quality
npm run lint              # Lint code
npm run format            # Format code
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USERNAME` | DB username | `postgres` |
| `DATABASE_PASSWORD` | DB password | `password` |
| `DATABASE_NAME` | DB name | `doctor_appointment` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `THROTTLE_TTL` | Rate limit window | `60` |
| `THROTTLE_LIMIT` | Rate limit requests | `10` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM for excellent database integration
- Swagger for API documentation

---

**Happy Coding! 🩺**
# Appointment-Booking-System
