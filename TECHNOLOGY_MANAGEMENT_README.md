# Technology Management System

A comprehensive full-stack technology management system built with NestJS backend and Next.js frontend, featuring CRUD operations, file uploads, advanced filtering, and a beautiful glassmorphism UI.

## 🚀 Features

### Backend Features
- **Complete CRUD Operations** - Create, read, update, delete technologies
- **Advanced Filtering & Search** - Filter by category, status, difficulty, tags, and more
- **File Upload Support** - Upload technology images and icons
- **Validation & Error Handling** - Comprehensive input validation with class-validator
- **Public & Admin APIs** - Separate endpoints for public portfolio and admin management
- **Statistics & Analytics** - Technology usage statistics and proficiency tracking
- **Bulk Operations** - Bulk update status and delete multiple technologies
- **Pagination & Sorting** - Efficient data handling with pagination and sorting

### Frontend Features
- **Modern Admin Dashboard** - Beautiful glassmorphism design with dark theme
- **Grid & Table Views** - Switch between card grid and detailed table views
- **Advanced Filtering** - Real-time filtering with multiple criteria
- **Search Functionality** - Instant search across technology names, descriptions, and tags
- **File Upload Interface** - Drag-and-drop file upload with preview
- **Bulk Actions** - Select multiple items for bulk operations
- **Responsive Design** - Mobile-first responsive design
- **Real-time Updates** - React Query for optimistic updates and caching
- **Form Validation** - Comprehensive form validation with Zod schemas
- **Modal Details** - Detailed technology information in modal overlays

### Portfolio Integration
- **Public Technology Showcase** - Beautiful technology showcase for portfolio websites
- **Featured Technologies** - Highlight your best technologies
- **Category Filtering** - Filter technologies by category for visitors
- **Proficiency Display** - Visual proficiency levels and skill progression
- **Responsive Cards** - Beautiful technology cards with hover effects

## 📁 Project Structure

### Backend Structure
```
server/src/modules/technology-management/
├── api/
│   ├── controllers/
│   │   ├── technology.admin.controller.ts    # Admin CRUD operations
│   │   └── technology.public.controller.ts   # Public read-only API
│   └── dto/
│       ├── request/
│       │   ├── create-technology.dto.ts       # Create validation
│       │   ├── update-technology.dto.ts       # Update validation
│       │   └── get-all-technologies.dto.ts    # Query validation
│       └── response/
│           └── technology-response.dto.ts     # Response types
├── database/
│   ├── schemas/
│   │   └── technology.schema.ts               # MongoDB schema
│   └── repositories/
│       └── technology.repository.ts           # Database operations
├── services/
│   ├── technology.service.ts                  # Business logic
│   └── technology.error.ts                    # Error handling
└── technology-management.module.ts            # Module configuration
```

### Frontend Structure
```
client/
├── app/(admin)/admin/technologies/
│   ├── page.tsx                              # Main technologies page
│   ├── create/page.tsx                       # Create technology page
│   ├── edit/[id]/page.tsx                    # Edit technology page
│   ├── test/page.tsx                         # API testing page
│   └── components/
│       ├── TechnologyGrid.tsx                # Grid view component
│       ├── TechnologyTable.tsx               # Table view component
│       ├── TechnologyForm.tsx                # Create/edit form
│       ├── TechnologyModal.tsx               # Detail modal
│       ├── TechnologyStats.tsx               # Statistics display
│       ├── TechnologyFiltersPanel.tsx        # Advanced filters
│       └── BulkActionsBar.tsx               # Bulk operations
├── lib/
│   ├── types/technology.ts                   # TypeScript interfaces
│   ├── api/
│   │   ├── admin/technologies.ts             # Admin API client
│   │   └── public/technologies.ts            # Public API client
│   └── hooks/
│       ├── use-technologies.ts               # Admin React Query hooks
│       └── use-public-technologies.ts        # Public React Query hooks
└── components/portfolio/
    └── TechnologyShowcase.tsx                # Portfolio component
```

## 🛠 Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Class Validator** - Validation decorators
- **Multer** - File upload handling
- **TypeScript** - Type-safe development

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **Tailwind CSS** - Utility-first CSS
- **React Icons** - Icon library

## 🎨 Design System

### Glassmorphism Theme
- **Dark Background** - Deep dark theme with purple accents
- **Glass Cards** - Translucent cards with backdrop blur
- **Gradient Buttons** - Beautiful gradient buttons with glow effects
- **Smooth Animations** - Framer Motion animations throughout
- **Responsive Design** - Mobile-first responsive layout

### Color Palette
- **Primary**: Purple/Blue gradient (#8B5CF6 to #3B82F6)
- **Accent**: Purple (#A855F7)
- **Background**: Dark grays (#0F172A, #1E293B)
- **Text**: White and light grays
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

## 📊 Database Schema

### Technology Model
```typescript
{
  _id: ObjectId,
  name: string,                    // Technology name
  description: string,             // Short description
  longDescription?: string,        // Detailed description
  category: TechnologyCategory,    // Frontend, Backend, etc.
  status: TechnologyStatus,        // Active, Learning, Expert, etc.
  difficultyLevel: DifficultyLevel, // Beginner, Intermediate, etc.
  icon: string,                    // Icon URL
  image: string,                   // Main image URL
  images: string[],                // Additional images
  officialWebsite?: string,        // Official website URL
  documentation?: string,          // Documentation URL
  tags: string[],                  // Technology tags
  relatedTechnologies: string[],   // Related tech IDs
  proficiencyLevel: number,        // 0-100 proficiency
  estimatedLearningHours: number,  // Learning time estimate
  prerequisites: string[],         // Required knowledge
  learningResources: string[],     // Learning materials
  notes?: string,                  // Personal notes
  isFeatured: boolean,            // Featured technology
  version?: string,               // Technology version
  lastUsed?: Date,                // Last usage date
  projectsUsedIn: number,         // Project count
  isDeleted: boolean,             // Soft delete flag
  deletedAt?: Date,               // Deletion timestamp
  createdAt: Date,                // Creation timestamp
  updatedAt: Date                 // Update timestamp
}
```

## 🔧 API Endpoints

### Admin API (`/admin/technologies`)
- `GET /` - Get all technologies with filters
- `POST /` - Create new technology
- `GET /:id` - Get technology by ID
- `PUT /:id` - Update technology
- `DELETE /:id` - Delete technology
- `POST /:id/upload-image` - Upload technology image
- `POST /upload-icon` - Upload technology icon
- `GET /stats/overview` - Get statistics
- `GET /categories` - Get categories
- `GET /search` - Search technologies
- `GET /featured` - Get featured technologies
- `PUT /:id/proficiency` - Update proficiency level

### Public API (`/public/technologies`)
- `GET /` - Get active technologies
- `GET /featured` - Get featured technologies
- `GET /categories` - Get categories
- `GET /by-category/:category` - Get by category
- `GET /search` - Search technologies
- `GET /stats` - Get public statistics
- `GET /tags` - Get all tags

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sillalink
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Backend (.env)
DATABASE_URL=mongodb://localhost:27017/sillalink
JWT_SECRET=your-jwt-secret
PORT=5000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. **Start the services**
```bash
# Using Docker
docker-compose up -d

# Or manually
# Backend
cd server && npm run start:dev

# Frontend
cd client && npm run dev
```

### Usage

1. **Access the admin dashboard**: `http://localhost:3000/admin/technologies`
2. **Test the API**: `http://localhost:3000/admin/technologies/test`
3. **View portfolio showcase**: Use the `TechnologyShowcase` component

## 🧪 Testing

### API Testing
Visit `/admin/technologies/test` to run comprehensive API tests including:
- CRUD operations
- Search and filtering
- File uploads
- Public API endpoints
- Error handling

### Manual Testing
1. Create a new technology
2. Upload images and icons
3. Test filtering and search
4. Try bulk operations
5. Verify public API responses

## 🔒 Security Features

- **Input Validation** - Comprehensive validation with class-validator
- **File Upload Security** - File type and size restrictions
- **Authentication** - JWT-based authentication for admin routes
- **Authorization** - Role-based access control
- **Data Sanitization** - XSS protection and input sanitization

## 📈 Performance Features

- **Pagination** - Efficient data loading with pagination
- **Caching** - React Query caching for optimal performance
- **Lazy Loading** - Component and image lazy loading
- **Optimistic Updates** - Immediate UI updates with rollback
- **Debounced Search** - Optimized search performance

## 🎯 Future Enhancements

- [ ] Technology comparison features
- [ ] Learning path recommendations
- [ ] Integration with project management
- [ ] Advanced analytics dashboard
- [ ] Export/import functionality
- [ ] Technology roadmap planning
- [ ] Skill assessment tools
- [ ] Team collaboration features

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
