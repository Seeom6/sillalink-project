"use client"

import { useState } from "react"
import { Plus, Filter, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Container } from "@/app/shared/components/layout/Container"
import { PageHeader } from "@/app/shared/components/layout/PageHeader"
import { ContentGrid } from "@/app/shared/components/content/ContentGrid"
import { ServiceCard } from "@/app/shared/components/content/ServiceCard"
import { LoadingState } from "@/app/shared/components/data-display/LoadingState"
import { EmptyState } from "@/app/shared/components/data-display/EmptyState"
import Button from "@/app/shared/ui/button"
import { Card } from "@/app/shared/ui/Card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select"
import { useServices, useDeleteService } from "@/app/shared/hooks/useServices"
import { useFilters } from "@/app/shared/hooks/useFilters"
import { Service, ServiceFilters, SERVICE_CATEGORIES, SERVICE_STATUSES, PRICE_TYPES } from "@/app/data/models/Service"

export default function ServiceManager() {
  const router = useRouter()
  
  const { filters, setFilter } = useFilters<ServiceFilters>({
    search: "",
    category: "all",
    status: "all",
    priceType: "all",
    page: 1,
    limit: 12,
    sortBy: "sortOrder",
    sortOrder: "asc"
  })

  const { data: servicesResponse, isLoading, error } = useServices(filters)
  const { mutate: deleteService } = useDeleteService()

  const services = servicesResponse?.data || []
  const total = servicesResponse?.total || 0

  const handleAddService = () => {
    router.push("/services/add-service")
  }

  const handleEditService = (service: Service) => {
    router.push(`/services/edit/${service.id}`)
  }

  const handleDeleteService = (service: Service) => {
    if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
      deleteService(service.id)
    }
  }

  const handleViewService = (service: Service) => {
    router.push(`/services/view/${service.id}`)
  }

  const headerActions = (
    <Button
      onClick={handleAddService}
      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Service
    </Button>
  )

  return (
    <Container variant="admin" size="xl">
      <PageHeader
        title="Services"
        description={`Manage your service offerings (${total} total)`}
        variant="admin"
        actions={headerActions}
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filters.category} onValueChange={(value) => setFilter("category", value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {SERVICE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilter("status", value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {SERVICE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priceType} onValueChange={(value) => setFilter("priceType", value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Price Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Price Types</SelectItem>
                {PRICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {error ? (
        <Card className="p-6 text-center text-red-600">
          Error loading services: {error.message}
        </Card>
      ) : isLoading ? (
        <LoadingState variant="admin" type="grid" count={12} />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Get started by adding your first service offering to attract clients."
          variant="admin"
          actionLabel="Add Your First Service"
          onAction={handleAddService}
        />
      ) : (
        <ContentGrid
          variant="admin"
          columns={{ mobile: 1, tablet: 2, desktop: 3, large: 4 }}
          gap="md"
        >
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant="admin"
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onView={handleViewService}
            />
          ))}
        </ContentGrid>
      )}

      {/* Pagination would go here */}
    </Container>
  )
}
