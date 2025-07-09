import { NextRequest, NextResponse } from 'next/server'
import { Service, ServiceData, ServiceFilters, ServicesResponse } from '@/app/data/models/Service'
import { serviceSchema } from '@/app/data/schemas/serviceSchema'

// Mock data for development - replace with actual database calls
const mockServices: Service[] = [
  {
    id: "1",
    title: "UI/UX Design",
    description: "We transform ideas into seamless and engaging user experiences, ensuring top-notch usability and aesthetics.",
    longDescription: "Our UI/UX design service focuses on creating intuitive, user-centered designs that not only look great but also provide exceptional user experiences. We conduct thorough user research, create wireframes and prototypes, and deliver pixel-perfect designs that align with your brand and business goals.",
    icon: "PenTool",
    status: "Active",
    category: "UI/UX Design",
    price: "$2,500+",
    priceType: "Project",
    features: [
      "User Research & Analysis",
      "Wireframing & Prototyping",
      "Visual Design",
      "Usability Testing",
      "Design System Creation",
      "Responsive Design"
    ],
    benefits: [
      "Improved User Satisfaction",
      "Higher Conversion Rates",
      "Reduced Development Time",
      "Brand Consistency"
    ],
    deliverables: [
      "Design System",
      "High-fidelity Mockups",
      "Interactive Prototypes",
      "Style Guide",
      "Asset Library"
    ],
    timeline: "2-4 weeks",
    technologies: ["Figma", "Adobe XD", "Sketch", "Principle", "InVision"],
    requirements: [
      "Project Brief",
      "Brand Guidelines",
      "Content Strategy",
      "Target Audience Info"
    ],
    isPopular: true,
    isFeatured: true,
    sortOrder: 1,
    delay: 0.1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    title: "Software Development",
    description: "We transform ideas into seamless and engaging user experiences, ensuring top-notch usability and aesthetics.",
    longDescription: "Our software development service covers the full development lifecycle from planning to deployment. We specialize in modern web technologies and create scalable, maintainable applications that grow with your business.",
    icon: "Code",
    status: "Active",
    category: "Software Development",
    price: "$5,000+",
    priceType: "Project",
    features: [
      "Full-stack Development",
      "API Development",
      "Database Design",
      "Testing & QA",
      "Performance Optimization",
      "Deployment & DevOps"
    ],
    benefits: [
      "Scalable Architecture",
      "Clean, Maintainable Code",
      "Fast Performance",
      "Security Best Practices"
    ],
    deliverables: [
      "Source Code",
      "Documentation",
      "Deployment Scripts",
      "Testing Suite",
      "Performance Reports"
    ],
    timeline: "4-12 weeks",
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    requirements: [
      "Technical Requirements",
      "User Stories",
      "API Specifications",
      "Hosting Preferences"
    ],
    isPopular: true,
    isFeatured: true,
    sortOrder: 2,
    delay: 0.2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    title: "Data Analysis",
    description: "We help you extract valuable insights from your data, enabling smarter decisions and business growth.",
    longDescription: "Our data analysis service helps businesses make data-driven decisions by extracting meaningful insights from complex datasets. We provide comprehensive analysis, visualization, and reporting solutions.",
    icon: "BarChart3",
    status: "Active",
    category: "Data Analysis",
    price: "$150/hour",
    priceType: "Hourly",
    features: [
      "Data Collection & Cleaning",
      "Statistical Analysis",
      "Data Visualization",
      "Predictive Modeling",
      "Report Generation",
      "Dashboard Creation"
    ],
    benefits: [
      "Data-driven Insights",
      "Improved Decision Making",
      "Cost Optimization",
      "Risk Assessment"
    ],
    deliverables: [
      "Analysis Reports",
      "Interactive Dashboards",
      "Data Models",
      "Recommendations",
      "Documentation"
    ],
    timeline: "1-6 weeks",
    technologies: ["Python", "R", "SQL", "Tableau", "Power BI", "Excel"],
    requirements: [
      "Data Sources",
      "Analysis Objectives",
      "Business Context",
      "Reporting Requirements"
    ],
    isPopular: false,
    isFeatured: false,
    sortOrder: 3,
    delay: 0.3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    title: "Project Consulting",
    description: "We transform ideas into seamless and engaging user experiences, ensuring top-notch usability and aesthetics.",
    longDescription: "Our project consulting service provides expert guidance throughout your project lifecycle. We help you plan, execute, and deliver successful projects on time and within budget.",
    icon: "Lightbulb",
    status: "Active",
    category: "Project Consulting",
    price: "$200/hour",
    priceType: "Hourly",
    features: [
      "Project Planning",
      "Risk Assessment",
      "Team Coordination",
      "Quality Assurance",
      "Progress Monitoring",
      "Stakeholder Management"
    ],
    benefits: [
      "Reduced Project Risk",
      "Improved Efficiency",
      "Better Communication",
      "Quality Delivery"
    ],
    deliverables: [
      "Project Plan",
      "Risk Assessment",
      "Progress Reports",
      "Recommendations",
      "Best Practices Guide"
    ],
    timeline: "Ongoing",
    technologies: ["Agile", "Scrum", "Kanban", "Jira", "Confluence", "Slack"],
    requirements: [
      "Project Scope",
      "Team Structure",
      "Timeline",
      "Budget Constraints"
    ],
    isPopular: false,
    isFeatured: false,
    sortOrder: 4,
    delay: 0.4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

// GET /api/content/services - Get all services with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate filters
    const filters: ServiceFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      priceType: searchParams.get('priceType') || undefined,
      isPopular: searchParams.get('isPopular') ? searchParams.get('isPopular') === 'true' : undefined,
      isFeatured: searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: (searchParams.get('sortBy') as any) || 'sortOrder',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc'
    }

    // Apply filters
    let filteredServices = [...mockServices]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredServices = filteredServices.filter(service =>
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category && filters.category !== 'all') {
      filteredServices = filteredServices.filter(service => service.category === filters.category)
    }

    if (filters.status && filters.status !== 'all') {
      filteredServices = filteredServices.filter(service => service.status === filters.status)
    }

    if (filters.priceType && filters.priceType !== 'all') {
      filteredServices = filteredServices.filter(service => service.priceType === filters.priceType)
    }

    if (filters.isPopular !== undefined) {
      filteredServices = filteredServices.filter(service => service.isPopular === filters.isPopular)
    }

    if (filters.isFeatured !== undefined) {
      filteredServices = filteredServices.filter(service => service.isFeatured === filters.isFeatured)
    }

    // Apply sorting
    filteredServices.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof Service]
      const bValue = b[filters.sortBy as keyof Service]
      
      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      }
      return aValue < bValue ? -1 : 1
    })

    // Apply pagination
    const total = filteredServices.length
    const totalPages = Math.ceil(total / filters.limit!)
    const startIndex = (filters.page! - 1) * filters.limit!
    const endIndex = startIndex + filters.limit!
    const paginatedServices = filteredServices.slice(startIndex, endIndex)

    const response: ServicesResponse = {
      data: paginatedServices,
      total,
      page: filters.page!,
      limit: filters.limit!,
      totalPages
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/content/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate data
    const validatedData = serviceSchema.parse(body)
    
    // Create new service (mock implementation)
    const newService: Service = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real implementation, save to database
    mockServices.push(newService)

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 400 }
    )
  }
}
