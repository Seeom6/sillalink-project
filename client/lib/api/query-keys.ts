import { GetAllUsersParams } from './admin/users';

export const queryKeys = {
  admin: {
    users: {
      all: ['admin', 'users'] as const,
      list: (filters: GetAllUsersParams) => [...queryKeys.admin.users.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.users.all, 'detail', id] as const,
    },
    employees: {
      all: ['admin', 'employees'] as const,
      list: (filters: any) => [...queryKeys.admin.employees.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.employees.all, 'detail', id] as const,
    },
    projects: {
      all: ['admin', 'projects'] as const,
      list: (filters: any) => [...queryKeys.admin.projects.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.projects.all, 'detail', id] as const,
    },
    technologies: {
      all: ['admin', 'technologies'] as const,
      list: (filters: any) => [...queryKeys.admin.technologies.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.technologies.all, 'detail', id] as const,
    },
    services: {
      all: ['admin', 'services'] as const,
      list: (filters: any) => [...queryKeys.admin.services.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.services.all, 'detail', id] as const,
    },
    health: {
      all: ['admin', 'health'] as const,
      overall: () => [...queryKeys.admin.health.all, 'overall'] as const,
      database: () => [...queryKeys.admin.health.all, 'database'] as const,
      redis: () => [...queryKeys.admin.health.all, 'redis'] as const,
    },
  },
  public: {
    projects: {
      all: ['public', 'projects'] as const,
      featured: () => [...queryKeys.public.projects.all, 'featured'] as const,
      detail: (id: string) => [...queryKeys.public.projects.all, 'detail', id] as const,
    },
    services: {
      all: ['public', 'services'] as const,
      list: () => [...queryKeys.public.services.all, 'list'] as const,
      detail: (id: string) => [...queryKeys.public.services.all, 'detail', id] as const,
    },
    employees: {
      all: ['public', 'employees'] as const,
      list: () => [...queryKeys.public.employees.all, 'list'] as const,
      detail: (id: string) => [...queryKeys.public.employees.all, 'detail', id] as const,
    },
  },
};
