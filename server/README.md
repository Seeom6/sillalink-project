# SillaLink Server

A comprehensive business portfolio and management platform built with NestJS, featuring modular architecture and modern development practices.

## Description

SillaLink is a full-stack business portfolio platform that provides:
- **Portfolio Management**: Showcase projects, technologies, and services
- **Employee Management**: Comprehensive employee profiles and management
- **Project Management**: Project lifecycle and task management
- **Authentication System**: Secure JWT-based authentication with role management
- **Admin Dashboard**: Complete administrative interface
- **API-First Design**: RESTful APIs for all functionality

Built with [NestJS](https://github.com/nestjs/nest) framework and following Domain-Driven Design principles.

## Architecture

This project follows a **modular architecture** with complete separation of concerns. Each business domain is encapsulated in its own module with consistent structure.

📖 **[Read the complete Architecture Documentation](./ARCHITECTURE.md)**

### Key Modules:
- **auth-system**: Authentication and authorization
- **user-management**: Core user entity management
- **employee-management**: Employee-specific operations
- **project-management**: Project and task management
- **technology-management**: Technology stack management
- **service-management**: Business service offerings
- **health-monitoring**: System health and monitoring

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose
- MongoDB (via Docker)
- Redis (via Docker)

## Installation

```bash
# Install dependencies
$ yarn install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your configuration
```

## Running the Application

### Development with Docker (Recommended)

```bash
# Start containers (MongoDB + Redis)
$ yarn containers:up

# Start development server
$ yarn start:dev

# Stop containers when done
$ yarn containers:down
```

### Manual Development Setup

```bash
# Start MongoDB and Redis manually, then:
$ yarn start:dev
```

### Production

```bash
# Build the application
$ yarn build

# Start production server
$ yarn start:prod
```

## Available Scripts

```bash
# Development
$ yarn start:dev          # Start with hot reload
$ yarn start:debug        # Start with debugging

# Production
$ yarn build              # Build for production
$ yarn start:prod         # Start production server

# Testing
$ yarn test               # Unit tests
$ yarn test:e2e           # End-to-end tests
$ yarn test:cov           # Test coverage

# Docker
$ yarn containers:up      # Start development containers
$ yarn containers:down    # Stop development containers

# Database
$ yarn seed               # Run database seeders
```

## API Documentation

Once the server is running, you can access:

- **API Base URL**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/api/v1/health`
- **Admin Routes**: `http://localhost:5000/api/v1/admin/*`
- **Public Routes**: `http://localhost:5000/api/v1/website/*`

## Project Structure

```
server/
├── src/
│   ├── modules/              # Business domain modules
│   │   ├── auth-system/      # Authentication & authorization
│   │   ├── user-management/  # User entity management
│   │   ├── employee-management/ # Employee operations
│   │   ├── project-management/  # Project & task management
│   │   ├── technology-management/ # Technology stack
│   │   ├── service-management/   # Business services
│   │   └── health-monitoring/    # System health
│   ├── package/              # Shared packages & utilities
│   ├── common/               # Common constants & types
│   └── main.ts              # Application entry point
├── seeders/                  # Database seeders
├── templates/                # Email templates
├── public/                   # Static files
└── ARCHITECTURE.md          # Detailed architecture docs
```

## Environment Configuration

Key environment variables:

```bash
# Application
PORT=5000
NODE_ENV=development

# Database
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_NAME=silla_link

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Email (choose one provider)
EMAIL_PROVIDER=gmail|resend|mailersend
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

## Contributing

1. Follow the modular architecture patterns
2. Add new modules using the established structure
3. Update documentation for any architectural changes
4. Ensure all tests pass before submitting PRs
5. Follow the naming conventions outlined in ARCHITECTURE.md

## Support

For technical support or questions about the architecture, please refer to:
- [Architecture Documentation](./ARCHITECTURE.md)
- Project issue tracker
- Development team contacts

## License

This project is licensed under the MIT License.
