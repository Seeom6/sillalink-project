import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/app/data/models/Project'
import { projectSchema } from '@/app/data/schemas/projectSchema'

// Mock data - replace with actual database calls
const mockProjects: Project[] = [
  // Same mock data as in the main route
]

// GET /api/content/projects/[id] - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = mockProjects.find(p => p.id === params.id)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/content/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate data
    const validatedData = projectSchema.parse(body)
    
    // Find project
    const projectIndex = mockProjects.findIndex(p => p.id === params.id)
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update project
    const updatedProject: Project = {
      ...mockProjects[projectIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    }

    mockProjects[projectIndex] = updatedProject

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 400 }
    )
  }
}

// DELETE /api/content/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectIndex = mockProjects.findIndex(p => p.id === params.id)
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Remove project
    mockProjects.splice(projectIndex, 1)

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
