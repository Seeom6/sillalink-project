"use client";

import { useRouter, useParams } from "next/navigation";
import { useTechnology, useTechnologyActions } from "@/app/hooks/technology/useTechnology";
import { EditTechnologyForm } from "../../components/TechnologyForm";
import { TechnologyFormData } from "@/app/types/technologyTypes";
import { LoadingState } from "@/app/shared/components/data-display/LoadingState";
import { Card } from "@/app/shared/ui/Card";

export default function EditTechnologyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Validate ID before proceeding
  if (!id || id === 'undefined') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>Invalid technology ID. Please go back and try again.</p>
          <button
            onClick={() => router.push('/admin/technologies')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Technologies
          </button>
        </Card>
      </div>
    );
  }

  const { technology, loading: isLoading, error } = useTechnology(id);
  const { updateTechnology, loading: isPending } = useTechnologyActions();

  // Show loading state while fetching technology
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading technology details...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if technology fetch failed
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/technologies')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Technologies
          </button>
        </Card>
      </div>
    );
  }

  // Show error if no technology data
  if (!technology) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Technology Not Found</h1>
          <p className="text-gray-600 mb-4">The requested technology could not be found.</p>
          <button
            onClick={() => router.push('/admin/technologies')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Technologies
          </button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: any, imageFile?: File) => {
    if (!id) return;

    // Convert EditTechnologyFormData to TechnologyFormData
    const formData: TechnologyFormData = {
      name: data.name,
      description: data.description,
      category: data.category,
      status: data.status,
      difficultyLevel: data.difficultyLevel,
      proficiencyLevel: data.proficiencyLevel,
      estimatedLearningHours: data.estimatedLearningHours,
      isFeatured: data.isFeatured,
      version: data.version,
      officialWebsite: data.officialWebsite,
      documentation: data.documentation,
      notes: data.notes,
      projectsUsedIn: data.projectsUsedIn,      
      tags: [],
      relatedTechnologies: [],
      prerequisites: [],
      learningResources: [],
      longDescription: data.description, // Use description as fallback
      icon: technology?.icon || '',
    };

    const result = await updateTechnology(id, formData, imageFile);
    if (result) {
      router.push("/admin/technologies");
    }
  };

  const handleCancel = () => {
    router.push("/admin/technologies");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState variant="admin" type="card" count={1} />
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Technology Not Found</h2>
            <p className="text-gray-600 mb-4">The technology you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => router.push("/admin/technologies")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Technologies
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Technology</h1>
        <p className="text-gray-600 mt-1">
          Update the technology details and track your proficiency
        </p>
      </div>

      {/* Form */}
      <div className="mt-8">
        <EditTechnologyForm
          initialData={technology}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
