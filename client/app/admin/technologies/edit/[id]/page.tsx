"use client";

import { useRouter, useParams } from "next/navigation";
import { useGetTechnology, useUpdateTechnology } from "@/app/hooks/technology/useTechnology";
import { EditTechnologyForm } from "../../components/TechnologyForm";
import { UpdateTechnologyPayload } from "@/app/api/technology/technology-api-type";
import { LoadingState } from "@/app/shared/components/data-display/LoadingState";
import { Card } from "@/app/shared/ui/Card";

export default function EditTechnologyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: technology, isLoading, error } = useGetTechnology(id);
  const { mutate: updateTechnology, isPending } = useUpdateTechnology();

  const handleSubmit = (data: Omit<UpdateTechnologyPayload, 'id'>) => {
    const payload: UpdateTechnologyPayload = { ...data, id };
    updateTechnology({ id, payload }, {
      onSuccess: () => {
        router.push("/admin/technologies");
      }
    });
  };

  const handleCancel = () => {
    router.push("/admin/technologies");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading technology details..." />
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
          initialData={technology.data}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
