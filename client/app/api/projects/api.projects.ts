import { type NextRequest, NextResponse } from "next/server"
import type { Project, ProjectsResponse } from "@/app/types/projectTypes"

// Mock data - replace with your actual data source
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Dbhamz.com",
    photo: "/images/project-thumbnail.png",
    link: "https://dbhamz.com",
    technologies: [
      { id: "1", name: "React", icon: "/placeholder.svg?height=24&width=24" },
      { id: "2", name: "Next.js", icon: "/placeholder.svg?height=24&width=24" },
      { id: "3", name: "TypeScript", icon: "/placeholder.svg?height=24&width=24" },
      { id: "4", name: "Tailwind", icon: "/placeholder.svg?height=24&width=24" },
      { id: "5", name: "Node.js", icon: "/placeholder.svg?height=24&width=24" },
      { id: "6", name: "MongoDB", icon: "/placeholder.svg?height=24&width=24" },
    ],
    description: "This project is selling perfume in the Gulf region with advanced e-commerce features.",
    executors: [
      { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", name: "Alice Brown", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", name: "Charlie Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "6", name: "Diana Prince", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    raised: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Dbhamz.com",
    photo: "/images/project-thumbnail.png",
    link: "https://dbhamz.com",
    technologies: [
      { id: "1", name: "React", icon: "/placeholder.svg?height=24&width=24" },
      { id: "2", name: "Next.js", icon: "/placeholder.svg?height=24&width=24" },
      { id: "3", name: "TypeScript", icon: "/placeholder.svg?height=24&width=24" },
      { id: "4", name: "Tailwind", icon: "/placeholder.svg?height=24&width=24" },
      { id: "5", name: "PostgreSQL", icon: "/placeholder.svg?height=24&width=24" },
      { id: "6", name: "Prisma", icon: "/placeholder.svg?height=24&width=24" },
    ],
    description: "This project is selling perfume in the Gulf region with modern tech stack.",
    executors: [
      { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", name: "Alice Brown", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", name: "Charlie Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "6", name: "Diana Prince", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    raised: true,
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Dbhamz.com",
    photo: "/images/project-thumbnail.png",
    link: "https://dbhamz.com",
    technologies: [
      { id: "1", name: "React", icon: "/placeholder.svg?height=24&width=24" },
      { id: "2", name: "Next.js", icon: "/placeholder.svg?height=24&width=24" },
      { id: "3", name: "TypeScript", icon: "/placeholder.svg?height=24&width=24" },
      { id: "4", name: "Tailwind", icon: "/placeholder.svg?height=24&width=24" },
      { id: "5", name: "Supabase", icon: "/placeholder.svg?height=24&width=24" },
    ],
    description: "This project is selling perfume in the Gulf region with real-time features.",
    executors: [
      { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", name: "Alice Brown", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", name: "Charlie Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    raised: false,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Dbhamz.com",
    photo: "/images/project-thumbnail.png",
    link: "https://dbhamz.com",
    technologies: [
      { id: "1", name: "React", icon: "/placeholder.svg?height=24&width=24" },
      { id: "2", name: "Next.js", icon: "/placeholder.svg?height=24&width=24" },
      { id: "3", name: "TypeScript", icon: "/placeholder.svg?height=24&width=24" },
    ],
    description: "This project is selling perfume in the Gulf region with minimal setup.",
    executors: [
      { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    raised: true,
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04",
  },
  {
    id: "5",
    name: "Dbhamz.com",
    photo: "/images/project-thumbnail.png",
    link: "https://dbhamz.com",
    technologies: [
      { id: "1", name: "React", icon: "/placeholder.svg?height=24&width=24" },
      { id: "2", name: "Next.js", icon: "/placeholder.svg?height=24&width=24" },
      { id: "3", name: "TypeScript", icon: "/placeholder.svg?height=24&width=24" },
      { id: "4", name: "Tailwind", icon: "/placeholder.svg?height=24&width=24" },
      { id: "5", name: "Firebase", icon: "/placeholder.svg?height=24&width=24" },
      { id: "6", name: "Stripe", icon: "/placeholder.svg?height=24&width=24" },
    ],
    description: "This project is selling perfume in the Gulf region with payment integration.",
    executors: [
      { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", name: "Alice Brown", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", name: "Charlie Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "6", name: "Diana Prince", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    raised: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Add a small delay to simulate real API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredProjects = mockProjects

    if (search) {
      filteredProjects = mockProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    const response: ProjectsResponse = {
      data: paginatedProjects,
      total: filteredProjects.length,
      page,
      limit,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
