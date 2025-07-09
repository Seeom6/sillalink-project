"use client"

import { memo } from "react"
import { Search, Filter, Plus } from "lucide-react"
import  Button  from "@/app/shared/ui/button"
import { Input } from "@/app/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/shared/ui/select"

interface TableFiltersProps {
  search: string
  status: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onAddUser: () => void
}

export const TableFilters = memo(({ search, status, onSearchChange, onStatusChange, onAddUser }: TableFiltersProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1 ">
        <div className="relative max-w-sm">
          <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-dashboard"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="wait">Wait</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onAddUser} className="bg-purple-600 rounded-lg hover:bg-purple-700">
        <Plus className="w-4 h-4 mr-2" />
        Add user
      </Button>
    </div>
  )
})

TableFilters.displayName = "TableFilters"
