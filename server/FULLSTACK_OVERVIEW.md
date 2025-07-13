# SillaLink Full-Stack Application Overview

## Project Architecture

SillaLink is a comprehensive business portfolio and management platform built with a modern, modular architecture that separates concerns between backend and frontend while maintaining seamless integration.

## Technology Stack

### Backend (NestJS Server)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session management
- **Authentication**: JWT with refresh tokens
- **Email**: Multiple providers (Gmail, Resend, MailerSend)
- **File Upload**: Multer with Sharp for image processing
- **Validation**: Class-validator and DTOs
- **Documentation**: Swagger/OpenAPI

### Frontend (Next.js Client)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui
- **State Management**: TanStack Query + Zustand
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SillaLink Platform                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)          │  Backend (NestJS)            │
│  ├── Admin Dashboard         │  ├── Auth System             │
│  │   ├── User Management     │  ├── User Management         │
│  │   ├── Employee Mgmt       │  ├── Employee Management     │
│  │   ├── Project Mgmt        │  ├── Project Management      │
│  │   ├── Technology Mgmt     │  ├── Technology Management   │
│  │   ├── Service Mgmt        │  ├── Service Management      │
│  │   └── Health Monitor      │  └── Health Monitoring       │
│  └── Public Website          │                              │
│      ├── Portfolio           │  Database Layer              │
│      ├── Services            │  ├── MongoDB (Primary)       │
│      ├── Team Profiles       │  └── Redis (Cache/Sessions)  │
│      └── Contact             │                              │
└─────────────────────────────────────────────────────────────┘
```

## Module Structure Alignment

The frontend and backend follow identical domain organization:

| Domain | Backend Module | Frontend Module | Purpose |
|--------|---------------|-----------------|---------|
| **Authentication** | `auth-system` | `auth` | User authentication & authorization |
| **User Management** | `user-management` | `admin/users` | Core user CRUD operations |
| **Employee Management** | `employee-management` | `admin/employees` | Employee profiles & management |
| **Project Management** | `project-management` | `admin/projects` | Project lifecycle & tasks |
| **Technology Management** | `technology-management` | `admin/technologies` | Tech stack & skills |
| **Service Management** | `service-management` | `admin/services` | Business offerings |
| **Health Monitoring** | `health-monitoring` | `admin/health` | System monitoring |

## API Integration

### Endpoint Structure
```
Backend API                     Frontend Integration
├── /api/v1/admin/*            ← Admin Dashboard
│   ├── /users                 ← User Management Module
│   ├── /employees             ← Employee Management Module
│   ├── /projects              ← Project Management Module
│   ├── /technologies          ← Technology Management Module
│   ├── /services              ← Service Management Module
│   └── /auth                  ← Admin Authentication
├── /api/v1/website/*          ← Public Website
│   ├── /auth                  ← Public Authentication
│   ├── /projects              ← Portfolio Showcase
│   ├── /services              ← Service Catalog
│   └── /employees/public      ← Team Profiles
└── /api/v1/health             ← Health Monitoring
```

### Authentication Flow
```
1. User Login (Frontend) → POST /api/v1/website/auth/log-in
2. Server validates credentials → Returns JWT tokens
3. Frontend stores tokens → Automatic API authentication
4. Role-based routing → Admin/Public access control
5. Token refresh → Seamless session management
```

## Data Flow Architecture

### Admin Dashboard Flow
```
Admin User → Login → JWT Token → Admin Routes → API Calls → Database
     ↓
Protected Admin Interface → CRUD Operations → Real-time Updates
```

### Public Website Flow
```
Public User → Browse → Public API → Cached Data → Display
     ↓
Contact Forms → Email Service → Admin Notifications
```

## Security Implementation

### Backend Security
- **JWT Authentication**: Access + Refresh token strategy
- **Role-based Access Control**: Admin, Operator, User, Employee roles
- **Input Validation**: DTOs with class-validator
- **Rate Limiting**: Express rate limiter
- **CORS Configuration**: Restricted origins
- **Password Hashing**: bcrypt with salt rounds

### Frontend Security
- **Route Protection**: NextAuth.js middleware
- **Role-based Components**: Permission-based rendering
- **Input Sanitization**: Zod schema validation
- **CSRF Protection**: Built-in Next.js protection
- **Secure Storage**: HTTP-only cookies for tokens

## Development Workflow

### Backend Development
```bash
# Start infrastructure
yarn containers:up

# Start development server
yarn start:dev

# Build and test
yarn build && yarn test

# Health check
curl http://localhost:5000/api/v1/health
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build and test
npm run build && npm run test

# Type checking
npm run type-check
```

## Deployment Architecture

### Production Setup
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vercel)      │───▶│   (Railway/     │───▶│   (MongoDB      │
│   Next.js App   │    │    Heroku)      │    │    Atlas)       │
│                 │    │   NestJS API    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Upstash)     │
                       └─────────────────┘
```

### Environment Configuration
```bash
# Backend (.env)
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.sillalink.com/api/v1
NEXTAUTH_URL=https://sillalink.com
NEXTAUTH_SECRET=...
```

## Key Features

### Admin Dashboard
- **User Management**: Complete CRUD with role assignment
- **Employee Profiles**: Department management and hierarchy
- **Project Tracking**: Task management and team assignments
- **Technology Catalog**: Skill tracking and proficiency levels
- **Service Management**: Business offerings and pricing
- **System Monitoring**: Real-time health and performance metrics

### Public Website
- **Portfolio Showcase**: Featured projects with technology highlights
- **Service Catalog**: Business offerings with detailed descriptions
- **Team Profiles**: Public employee information and expertise
- **Contact System**: Inquiry forms with email notifications
- **Responsive Design**: Mobile-first approach with modern UI

## Performance Optimizations

### Backend Optimizations
- **Database Indexing**: Strategic indexes on frequently queried fields
- **Caching Strategy**: Redis for session storage and query caching
- **Pagination**: Implemented across all list endpoints
- **Query Optimization**: Selective field population and aggregation

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for admin modules
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: TanStack Query with intelligent cache management
- **Bundle Optimization**: Tree shaking and dead code elimination

## Monitoring & Observability

### Backend Monitoring
- **Health Endpoints**: Database and Redis connectivity checks
- **Structured Logging**: JSON-formatted logs with context
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Metrics**: Request timing and resource usage

### Frontend Monitoring
- **Error Boundaries**: React error boundaries with logging
- **Web Vitals**: Core web vitals tracking
- **User Analytics**: Page views and user interaction tracking
- **Performance Monitoring**: Bundle size and load time optimization

## Documentation Structure

```
server/
├── ARCHITECTURE.md          # Backend architecture details
├── CLIENT_ARCHITECTURE.md   # Frontend architecture details
├── CLIENT_SETUP_GUIDE.md    # Frontend setup instructions
├── FULLSTACK_OVERVIEW.md    # This overview document
├── QUICK_REFERENCE.md       # Developer quick reference
└── README.md               # Project setup and overview
```

## Getting Started

### 1. Backend Setup
```bash
cd server
yarn install
yarn containers:up
yarn start:dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Access Points
- **Admin Dashboard**: http://localhost:3000/admin
- **Public Website**: http://localhost:3000
- **API Documentation**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/v1/health

## Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Business intelligence dashboard
- **Mobile App**: React Native companion app
- **API Versioning**: Support for multiple API versions
- **Microservices**: Gradual migration to microservices architecture

### Scalability Considerations
- **Horizontal Scaling**: Load balancer configuration
- **Database Sharding**: MongoDB sharding strategy
- **CDN Integration**: Static asset optimization
- **Caching Layers**: Multi-level caching strategy

This full-stack architecture provides a solid foundation for a modern business portfolio and management platform, with clear separation of concerns, type safety, and scalability built in from the ground up.
