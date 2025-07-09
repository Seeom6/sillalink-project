'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { techniqueApi } from '@/app/api/technique/technique.api';
import { TechniqueData, TechniqueFilters, Technique, TechniquesResponse } from '@/app/types/techniqueTypes';
import { useToast } from '../useToast';

// Mock data for development
const mockTechniques: Technique[] = [
  {
    id: "1",
    name: "UI/UX Design",
    description: "We believe that an exceptional visual and user experience is key to success. That's why we design elegant and user-friendly interfaces.",
    category: "UI/UX Design",
    difficulty: "Intermediate",
    icon: "🎨",
    image: "/assets/scentora.svg",
    technologies: ["Figma", "Adobe XD", "Sketch", "Principle"],
    status: "Active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Software Development",
    description: "We believe that an exceptional visual and user experience is key to success. That's why we design elegant and user-friendly solutions.",
    category: "Software Development",
    difficulty: "Advanced",
    icon: "💻",
    image: "/assets/dashboard.svg",
    technologies: ["React", "Node.js", "TypeScript", "Next.js"],
    status: "Active",
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z"
  },
  {
    id: "3",
    name: "Data & AI Solutions",
    description: "We leverage Artificial Intelligence and Machine Learning to analyze data and make accurate decisions, helping businesses improve performance.",
    category: "Data & AI Solutions",
    difficulty: "Expert",
    icon: "🤖",
    image: "/assets/HyperMartx.svg",
    technologies: ["Python", "TensorFlow", "PyTorch", "Pandas"],
    status: "Active",
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z"
  },
  {
    id: "4",
    name: "Mobile Development",
    description: "We believe that an exceptional visual and user experience is key to success. That's why we design elegant and user-friendly mobile apps.",
    category: "Mobile Development",
    difficulty: "Intermediate",
    icon: "📱",
    image: "/assets/scentora.svg",
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
    status: "Active",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z"
  },
  {
    id: "5",
    name: "DevOps & Infrastructure",
    description: "We believe that an exceptional visual and user experience is key to success. That's why we design elegant and user-friendly infrastructure.",
    category: "DevOps & Infrastructure",
    difficulty: "Advanced",
    icon: "⚙️",
    image: "/assets/dashboard.svg",
    technologies: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    status: "Active",
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-11T10:00:00Z"
  },
  {
    id: "6",
    name: "Web Development",
    description: "We believe that an exceptional visual and user experience is key to success. That's why we design elegant and user-friendly websites.",
    category: "Web Development",
    difficulty: "Beginner",
    icon: "🌐",
    image: "/assets/HyperMartx.svg",
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    status: "Active",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z"
  }
];

// Mock API function
const fetchTechniques = async (filters: TechniqueFilters): Promise<TechniquesResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredData = [...mockTechniques];
  
  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredData = filteredData.filter(technique =>
      technique.name.toLowerCase().includes(searchLower) ||
      technique.description.toLowerCase().includes(searchLower) ||
      technique.category.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.category && filters.category !== "all") {
    filteredData = filteredData.filter(technique => technique.category === filters.category);
  }
  
  if (filters.difficulty && filters.difficulty !== "all") {
    filteredData = filteredData.filter(technique => technique.difficulty === filters.difficulty);
  }
  
  if (filters.status && filters.status !== "all") {
    filteredData = filteredData.filter(technique => technique.status === filters.status);
  }
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    limit,
  };
};

export const useGetTechniques = (filters: TechniqueFilters) => {
  return useQuery({
    queryKey: ["techniques", filters],
    queryFn: () => fetchTechniques(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAddTechnique = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: TechniqueData) => techniqueApi.createTechnique(payload),
    onSuccess: (data: any) => {
      toast.success("Success!", "Technique created successfully");
      queryClient.invalidateQueries({ queryKey: ["techniques"] });
      router.push("/techniques");
    },
    onError: (err: any) => {
      toast.error("Error", "Failed to create technique. Please try again.");
    }
  });
};

export const useUpdateTechnique = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TechniqueData> }) => 
      techniqueApi.updateTechnique(id, data),
    onSuccess: () => {
      toast.success("Success!", "Technique updated successfully");
      queryClient.invalidateQueries({ queryKey: ["techniques"] });
    },
    onError: (err: any) => {
      toast.error("Error", "Failed to update technique. Please try again.");
    }
  });
};

export const useDeleteTechnique = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => techniqueApi.deleteTechnique(id),
    onSuccess: () => {
      toast.success("Success!", "Technique deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["techniques"] });
    },
    onError: (err: any) => {
      toast.error("Error", "Failed to delete technique. Please try again.");
    }
  });
};
