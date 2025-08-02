# Doctor Appointment Booking System

## 🚀 Features

### 👥 User Management
- **User Registration & Authentication** with JWT tokens
- **Role-based Access Control** (Admin, Patient)
- **User Profile Management** with update capabilities
- **Secure Password Hashing** using bcryptjs

### 👨‍⚕️ Doctor Management
- **Doctor Registration** (Admin only)
- **Doctor Profile Management** with specializations
- **Availability Management** with time slots
- **Experience & Qualification Tracking**
- **Consultation Fee Management**

### 📅 Appointment System
- **Book Appointments** with available doctors
- **Appointment Status Management** (Scheduled, Confirmed, Cancelled, Completed)
- **Real-time Availability Checking**
- **Appointment History** for patients and doctors
- **Automatic Conflict Prevention**

### 🔐 Security Features
- **JWT Authentication** with role-based authorization
- **Password Encryption** with bcryptjs
- **Request Rate Limiting** with Throttler
- **Input Validation** with class-validator
- **Security Headers** with Helmet
- **CORS Protection**

### 📚 API Documentation
- **Swagger/OpenAPI** interactive documentation
- **Auto-generated API specs**
- **Request/Response examples**
- **Authentication testing interface**

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend Framework** | NestJS v10.0.0 |
| **Language** | TypeScript v5.1.3 |
| **Database** | PostgreSQL |
| **ORM** | TypeORM v0.3.17 |
| **Authentication** | JWT, Passport.js |
| **Validation** | class-validator, class-transformer |
| **Documentation** | Swagger/OpenAPI |
| **Security** | Helmet, Throttler, bcryptjs |
| **Logging** | Winston |
| **Testing** | Jest, Supertest |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v12.0 or higher)
- **Git**

## � Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/axle-blaze/Appointment-Booking-System.git
cd Appointment-Booking-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### PostgreSQL Setup
1. Install PostgreSQL and start the service
2. Create a database:
```sql
CREATE DATABASE doctor_appointment;
```

#### Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=doctor_appointment

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=3000
NODE_ENV=development
```
### 4. Start the Application
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The application will be available at:
- **API Base URL**: http://localhost:3000/api/v1
- **Swagger Documentation**: http://localhost:3000/api/docs

## 📖 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/auth/register` | User registration | Public |
| POST | `/api/v1/auth/login` | User login | Public |

### User Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/users/profile` | Get user profile | Authenticated |
| PATCH | `/api/v1/users/profile` | Update user profile | Authenticated |
| GET | `/api/v1/users` | Get all users | Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |

### Doctor Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/doctors` | Create doctor | Admin |
| GET | `/api/v1/doctors` | Get all doctors | Public |
| GET | `/api/v1/doctors/:id` | Get doctor by ID | Public |
| GET | `/api/v1/doctors/specializations` | Get specializations | Public |
| GET | `/api/v1/doctors/:id/available-slots` | Get available slots | Authenticated |

### Appointment Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/appointments` | Book appointment | Patient |
| GET | `/api/v1/appointments/my` | Get my appointments | Authenticated |
| GET | `/api/v1/appointments` | Get all appointments | Admin |
| PATCH | `/api/v1/appointments/:id` | Update appointment | Admin/Owner |
| POST | `/api/v1/appointments/:id/cancel` | Cancel appointment | Admin/Owner |
| DELETE | `/api/v1/appointments/:id` | Delete appointment | Admin |

## 🔧 Development

### Project Structure
```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── auth/                      # Authentication module
│   ├── dto/                   # Data transfer objects
│   ├── guards/                # Auth guards
│   ├── strategies/            # Passport strategies
│   └── auth.service.ts        # Auth business logic
├── users/                     # User management module
│   ├── dto/                   # User DTOs
│   ├── entities/              # User entity
│   └── users.service.ts       # User business logic
├── doctors/                   # Doctor management module
│   ├── dto/                   # Doctor DTOs
│   ├── entities/              # Doctor entity
│   └── doctors.service.ts     # Doctor business logic
├── appointments/              # Appointment module
│   ├── dto/                   # Appointment DTOs
│   ├── entities/              # Appointment entity
│   └── appointments.service.ts # Appointment logic
├── database/                  # Database configuration
│   └── database.module.ts     # TypeORM configuration
└── common/                    # Shared utilities
    ├── decorators/            # Custom decorators
    ├── filters/               # Exception filters
    ├── guards/                # Custom guards
    └── interceptors/          # Response interceptors
```

### Available Scripts
```bash
# Development
npm run start:dev              # Start with hot reload
npm run start:debug            # Start in debug mode

# Building
npm run build                  # Build for production
npm run start:prod            # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run format                # Format code with Prettier

# Testing
npm run test                   # Run unit tests
npm run test:watch            # Run tests in watch mode
npm run test:cov              # Run tests with coverage
npm run test:e2e              # Run end-to-end tests

# Database
npm run migration:generate     # Generate migration
npm run migration:run          # Run migrations
npm run migration:revert       # Revert migration
npm run seed                   # Seed database
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### API Testing with cURL

#### Register Admin User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "1234567890",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

#### Create Doctor (Admin only)
```bash
curl -X POST http://localhost:3000/api/v1/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Dr. Smith",
    "specialization": "Cardiology",
    "email": "dr.smith@example.com",
    "phone": "1234567890",
    "experience": 10,
    "licenseNumber": "MD123456",
    "hospital": "City General",
    "consultationFee": 150,
    "startTime": "09:00",
    "endTime": "17:00",
    "availableDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }'
```

#### Book Appointment
```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorId": "doctor-uuid",
    "startTime": "2025-08-15T10:00:00Z",
    "endTime": "2025-08-15T10:30:00Z",
    "reason": "Regular checkup"
  }'
```

## 🔒 Security

This application implements several security best practices:

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs with salt rounds
- **Role-based Authorization** (Admin, Patient)
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS** configuration for cross-origin requests
- **Security Headers** via Helmet middleware
- **Environment Variables** for sensitive configuration

## 🌐 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DATABASE_TYPE=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=doctor_appointment
JWT_SECRET=your-super-secure-jwt-secret
PORT=3000
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `phone` (String, Optional)
- `password` (String, Hashed)
- `role` (Enum: ADMIN, PATIENT)
- `dateOfBirth` (Date, Optional)
- `address` (String, Optional)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Doctors Table
- `id` (UUID, Primary Key)
- `name` (String)
- `specialization` (String)
- `email` (String, Unique)
- `phone` (String)
- `experience` (Number)
- `licenseNumber` (String)
- `hospital` (String)
- `bio` (Text, Optional)
- `profileImage` (String, Optional)
- `consultationFee` (Decimal)
- `availableDays` (Array)
- `startTime`, `endTime` (Time)
- `appointmentDuration` (Number, default: 30)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Appointments Table
- `id` (UUID, Primary Key)
- `doctorId` (UUID, Foreign Key)
- `patientId` (UUID, Foreign Key)
- `startTime`, `endTime` (Timestamp)
- `status` (Enum: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
- `reason` (String, Optional)
- `notes` (Text, Optional)
- `createdAt`, `updatedAt` (Timestamps)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


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
