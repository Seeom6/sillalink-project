import { Module, Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
// Updated with full CRUD operations for technology management

// In-memory storage for technologies (for development/testing)
let technologiesStore = [
  {
    _id: '1',
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
    longDescription: 'React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.',
    category: 'frontend',
    status: 'active',
    difficultyLevel: 'intermediate',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    images: [],
    officialWebsite: 'https://reactjs.org',
    documentation: 'https://reactjs.org/docs',
    tags: ['javascript', 'frontend', 'ui', 'library'],
    relatedTechnologies: ['Next.js', 'Redux', 'TypeScript'],
    proficiencyLevel: 8,
    estimatedLearningHours: 40,
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
    learningResources: ['https://reactjs.org/tutorial', 'https://react.dev'],
    notes: 'Popular frontend library',
    isFeatured: true,
    version: '18.2.0',
    lastUsed: new Date(),
    projectsUsedIn: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    longDescription: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment.',
    category: 'backend',
    status: 'active',
    difficultyLevel: 'intermediate',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    images: [],
    officialWebsite: 'https://nodejs.org',
    documentation: 'https://nodejs.org/docs',
    tags: ['javascript', 'backend', 'runtime', 'server'],
    relatedTechnologies: ['Express.js', 'NestJS', 'MongoDB'],
    proficiencyLevel: 7,
    estimatedLearningHours: 35,
    prerequisites: ['JavaScript'],
    learningResources: ['https://nodejs.org/en/learn'],
    notes: 'Server-side JavaScript runtime',
    isFeatured: true,
    version: '20.0.0',
    lastUsed: new Date(),
    projectsUsedIn: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Technology Controller for admin technologies management
@Controller('admin/technologies')
export class TechnologyController {
  @Get()
  findAll(@Query() query: any) {
    // Handle pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = technologiesStore.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: technologiesStore.length,
        totalPages: Math.ceil(technologiesStore.length / limit)
      },
      message: 'Technologies retrieved successfully'
    };
  }

  @Post()
  create(@Body() createTechnologyDto: any) {
    // Basic validation
    if (!createTechnologyDto.name || createTechnologyDto.name.trim().length < 2) {
      throw new Error('Technology name must be at least 2 characters');
    }
    if (!createTechnologyDto.description || createTechnologyDto.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters');
    }
    // Generate new ID
    const newId = (technologiesStore.length + 1).toString();

    // Create new technology object
    const newTechnology = {
      _id: newId,
      name: createTechnologyDto.name,
      description: createTechnologyDto.description || `${createTechnologyDto.name} technology`,
      longDescription: createTechnologyDto.longDescription || createTechnologyDto.description,
      category: createTechnologyDto.category || 'other',
      status: createTechnologyDto.status || 'active',
      difficultyLevel: createTechnologyDto.difficultyLevel || 'beginner',
      icon: createTechnologyDto.icon || '',
      image: createTechnologyDto.image || '',
      images: createTechnologyDto.images || [],
      officialWebsite: createTechnologyDto.officialWebsite || '',
      documentation: createTechnologyDto.documentation || '',
      tags: createTechnologyDto.tags || [],
      relatedTechnologies: createTechnologyDto.relatedTechnologies || [],
      proficiencyLevel: createTechnologyDto.proficiencyLevel || 0,
      estimatedLearningHours: createTechnologyDto.estimatedLearningHours || 0,
      prerequisites: createTechnologyDto.prerequisites || [],
      learningResources: createTechnologyDto.learningResources || [],
      notes: createTechnologyDto.notes || '',
      isFeatured: createTechnologyDto.isFeatured || false,
      version: createTechnologyDto.version || '',
      lastUsed: createTechnologyDto.lastUsed || new Date(),
      projectsUsedIn: createTechnologyDto.projectsUsedIn || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to store
    technologiesStore.push(newTechnology);

    return {
      data: newTechnology,
      message: 'Technology created successfully'
    };
  }

  @Get('stats')
  getStats() {
    const total = technologiesStore.length;
    const active = technologiesStore.filter(t => t.status === 'active').length;
    const inactive = total - active;
    const featured = technologiesStore.filter(t => t.isFeatured).length;

    // Count by categories
    const categoriesCount: any = technologiesStore.reduce((acc: any, tech) => {
      acc[tech.category] = (acc[tech.category] || 0) + 1;
      return acc;
    }, {});

    // Count by difficulty levels
    const difficultyLevels: any = technologiesStore.reduce((acc: any, tech) => {
      acc[tech.difficultyLevel] = (acc[tech.difficultyLevel] || 0) + 1;
      return acc;
    }, {});

    // Calculate average proficiency
    const avgProficiency = technologiesStore.length > 0
      ? technologiesStore.reduce((sum, tech) => sum + (tech.proficiencyLevel || 0), 0) / technologiesStore.length
      : 0;

    // Total projects using technologies
    const totalProjectsUsing = technologiesStore.reduce((sum, tech) => sum + (tech.projectsUsedIn || 0), 0);

    return {
      totalTechnologies: total,
      activeTechnologies: active,
      inactiveTechnologies: inactive,
      featuredTechnologies: featured,
      categoriesCount: {
        frontend: categoriesCount.frontend || 0,
        backend: categoriesCount.backend || 0,
        database: categoriesCount.database || 0,
        devops: categoriesCount.devops || 0,
        mobile: categoriesCount.mobile || 0,
        other: categoriesCount.other || 0,
        ...categoriesCount
      },
      difficultyLevels: {
        beginner: difficultyLevels.beginner || 0,
        intermediate: difficultyLevels.intermediate || 0,
        advanced: difficultyLevels.advanced || 0,
        expert: difficultyLevels.expert || 0,
        ...difficultyLevels
      },
      averageProficiencyLevel: Math.round(avgProficiency * 10) / 10,
      totalProjectsUsing
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const technology = technologiesStore.find(t => t._id === id);
    if (!technology) {
      return {
        error: 'Technology not found',
        statusCode: 404
      };
    }
    return {
      data: technology,
      message: 'Technology retrieved successfully'
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTechnologyDto: any) {
    const index = technologiesStore.findIndex(t => t._id === id);
    if (index === -1) {
      return {
        error: 'Technology not found',
        statusCode: 404
      };
    }

    // Update technology
    technologiesStore[index] = {
      ...technologiesStore[index],
      ...updateTechnologyDto,
      _id: id, // Preserve ID
      updatedAt: new Date()
    };

    return {
      data: technologiesStore[index],
      message: 'Technology updated successfully'
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const index = technologiesStore.findIndex(t => t._id === id);
    if (index === -1) {
      return {
        error: 'Technology not found',
        statusCode: 404
      };
    }

    const deletedTechnology = technologiesStore.splice(index, 1)[0];

    return {
      data: deletedTechnology,
      message: 'Technology deleted successfully'
    };
  }
}

@Module({
  imports: [],
  controllers: [TechnologyController],
  providers: [],
  exports: []
})
export class TechnologyModule {}
