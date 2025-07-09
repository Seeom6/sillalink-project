import { NextRequest, NextResponse } from 'next/server'
import { Project, ProjectData, ProjectFilters, ProjectsResponse } from '@/app/data/models/Project'
import { projectSchema, projectFiltersSchema } from '@/app/data/schemas/projectSchema'

// Mock data for development - replace with actual database calls
const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "A modern e-commerce platform built with Next.js and Stripe integration for seamless online shopping experience.",
    longDescription: "This comprehensive e-commerce platform features user authentication, product catalog, shopping cart, payment processing, order management, and admin dashboard. Built with modern technologies for optimal performance and user experience.",
    image: "/assets/HyperMartx.svg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "PostgreSQL", "Prisma"],
    status: "Completed",
    category: "E-commerce",
    priority: "High",
    startDate: "2024-01-15",
    endDate: "2024-03-20",
    liveUrl: "https://example-ecommerce.com",
    githubUrl: "https://github.com/example/ecommerce",
    clientName: "TechStore Inc.",
    teamMembers: ["John Doe", "Jane Smith"],
    budget: 15000,
    progress: 100,
    features: ["User Authentication", "Product Catalog", "Shopping Cart", "Payment Processing", "Order Management", "Admin Dashboard"],
    challenges: ["Payment Integration", "Inventory Management", "Performance Optimization"],
    learnings: ["Stripe API Integration", "Database Optimization", "State Management"],
    tags: ["React", "E-commerce", "Full-stack"],
    isPublic: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-20T15:30:00Z"
  },
  {
    id: "2", 
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team collaboration features.",
    longDescription: "This task management application helps teams organize, track, and collaborate on projects efficiently. Features include real-time updates, file sharing, time tracking, and comprehensive reporting.",
    image: "/assets/dashboard.svg",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
    status: "Active",
    category: "Web Development",
    priority: "Medium",
    startDate: "2024-02-01",
    liveUrl: "https://taskapp-demo.com",
    githubUrl: "https://github.com/example/taskapp",
    clientName: "ProductivityCorp",
    teamMembers: ["Alice Johnson", "Bob Wilson"],
    budget: 12000,
    progress: 75,
    features: ["Real-time Collaboration", "File Sharing", "Time Tracking", "Reporting", "Mobile Responsive"],
    challenges: ["Real-time Synchronization", "Scalability", "Mobile Optimization"],
    learnings: ["WebSocket Implementation", "Real-time Architecture", "Performance Monitoring"],
    tags: ["React", "Real-time", "Collaboration"],
    isPublic: true,
    isFeatured: false,
    sortOrder: 2,
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-03-15T14:20:00Z"
  },
  {
    id: "3",
    title: "Portfolio Website",
    description: "A responsive portfolio website showcasing creative work with smooth animations and modern design.",
    longDescription: "This portfolio website features a clean, modern design with smooth animations, responsive layout, and optimized performance. Built to showcase creative work and professional achievements effectively.",
    image: "/assets/scentora.svg",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
    status: "Completed",
    category: "Portfolio",
    priority: "Low",
    startDate: "2024-01-10",
    endDate: "2024-02-05",
    liveUrl: "https://creative-portfolio.com",
    githubUrl: "https://github.com/example/portfolio",
    clientName: "Creative Studio",
    teamMembers: ["Designer Name"],
    budget: 5000,
    progress: 100,
    features: ["Responsive Design", "Smooth Animations", "Contact Form", "Gallery", "Blog"],
    challenges: ["Animation Performance", "Image Optimization", "SEO"],
    learnings: ["Framer Motion", "Performance Optimization", "SEO Best Practices"],
    tags: ["Portfolio", "Animation", "Design"],
    isPublic: true,
    isFeatured: false,
    sortOrder: 3,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-02-05T16:45:00Z"
  }
]

// GET /api/content/projects - Get all projects with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate filters
    const filters: ProjectFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      isFeatured: searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: (searchParams.get('sortBy') as any) || 'sortOrder',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc'
    }

    // Apply filters
    let filteredProjects = [...mockProjects]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      )
    }

    if (filters.category && filters.category !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.category === filters.category)
    }

    if (filters.status && filters.status !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.status === filters.status)
    }

    if (filters.priority && filters.priority !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.priority === filters.priority)
    }

    if (filters.isPublic !== undefined) {
      filteredProjects = filteredProjects.filter(project => project.isPublic === filters.isPublic)
    }

    if (filters.isFeatured !== undefined) {
      filteredProjects = filteredProjects.filter(project => project.isFeatured === filters.isFeatured)
    }

    // Apply sorting
    filteredProjects.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof Project]
      const bValue = b[filters.sortBy as keyof Project]
      
      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      }
      return aValue < bValue ? -1 : 1
    })

    // Apply pagination
    const total = filteredProjects.length
    const totalPages = Math.ceil(total / filters.limit!)
    const startIndex = (filters.page! - 1) * filters.limit!
    const endIndex = startIndex + filters.limit!
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    const response: ProjectsResponse = {
      data: paginatedProjects,
      total,
      page: filters.page!,
      limit: filters.limit!,
      totalPages
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/content/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate data
    const validatedData = projectSchema.parse(body)
    
    // Create new project (mock implementation)
    const newProject: Project = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real implementation, save to database
    mockProjects.push(newProject)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 400 }
    )
  }
}
