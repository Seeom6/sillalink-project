"use client";

import { useRouter } from "next/navigation";
import { useCreateTechnology } from "@/app/hooks/technology/useTechnology";
import { AddTechnologyForm } from "../components/TechnologyForm";
import { CreateTechnologyPayload } from "@/app/api/technology/technology-api-type";

export default function AddTechnologyPage() {
  const router = useRouter();
  const { mutate: createTechnology, isPending } = useCreateTechnology();



  const handleSubmit = (data: CreateTechnologyPayload) => {
    createTechnology(data, {
      onSuccess: () => {
        router.push("/admin/technologies");
      }
    });
  };

  const handleCancel = () => {
    router.push("/admin/technologies");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Technology</h1>
        <p className="text-gray-600 mt-1">
          Add a new technology to your stack and track your proficiency
        </p>

      </div>

      {/* Form */}
      <AddTechnologyForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isPending}
      />
    </div>
  );
}
