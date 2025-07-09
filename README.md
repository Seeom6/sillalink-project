# SillaLink Project

A modern full-stack web application built with Next.js 15 and NestJS, featuring a comprehensive business portfolio and admin management system.

## 🚀 Features

### Frontend (Next.js 15)
- **Modern UI/UX**: Responsive design with Tailwind CSS and Framer Motion animations
- **Authentication System**: Complete login/register flow with JWT tokens
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Portfolio Showcase**: Dynamic project and service displays
- **Contact Management**: Contact form with email integration
- **Performance Optimized**: Static asset optimization, lazy loading, and code splitting

### Backend (NestJS)
- **RESTful API**: Well-structured API endpoints
- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **Database Integration**: MongoDB with Mongoose ODM
- **File Upload**: Secure file handling and storage
- **Email Service**: Automated email notifications
- **Rate Limiting**: API protection and security measures
- **Logging**: Comprehensive logging system

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Tabler Icons, React Icons

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT with Passport
- **Validation**: Class Validator
- **File Upload**: Multer
- **Email**: Nodemailer

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2
- **Environment**: Development, Staging, Production configs
- **Version Control**: Git

## 📁 Project Structure

```
sillalink-project/
├── client/                 # Next.js Frontend
│   ├── app/               # App Router pages and layouts
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── public/           # Static assets
│   └── styles/           # Global styles
├── server/                # NestJS Backend
│   ├── src/              # Source code
│   ├── dist/             # Compiled output
│   ├── uploads/          # File uploads
│   ├── logs/             # Application logs
│   └── docker-compose.yml # Docker configuration
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Seeom6/sillalink-project.git
   cd sillalink-project
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Configuration

#### Backend (.env)
Copy `server/.env.example` to `server/.env` and configure:
- Database connection (MongoDB)
- JWT secrets
- Email service credentials
- Redis configuration (if using)

#### Frontend
The frontend automatically connects to the backend API. Update API endpoints in the configuration if needed.

## 🐳 Docker Deployment

### Development
```bash
cd server
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
cd server
docker-compose -f docker-compose.prod.yml up
```

## 📝 Recent Updates

### SVG Import Optimization (Latest)
- ✅ Fixed all SVG import issues by converting to static asset paths
- ✅ Optimized Next.js Image components with proper width/height properties
- ✅ Resolved module resolution conflicts
- ✅ Improved build performance and bundle size
- ✅ Enhanced loading performance with static asset caching

### Key Improvements
- **Performance**: Faster build times and smaller bundle size
- **Reliability**: No more module resolution errors
- **Maintainability**: Clean import structure and consistent patterns
- **User Experience**: Optimized loading and better error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Mohammed Al-slamat (@Seeom6)
- **Project**: SillaLink Business Portfolio Platform

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js 15 and NestJS**
