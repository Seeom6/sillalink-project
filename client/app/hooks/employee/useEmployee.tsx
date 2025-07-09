"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import type { EmployeesResponse, EmployeeFilters , Employee} from "@/app/types/employeeTypes"
import { createEmpPayload } from "@/app/api/employee/emp-api-type"
import { empApi } from "@/app/api/employee/employee.api"
import { useToast } from "../useToast"
import HandleError from "@/app/lib/ErrorEradication"

// Mock API function - replace with your actual API call
const fetchEmployees = async (filters: EmployeeFilters): Promise<EmployeesResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockData = [
    {
      id: "1",
      name: "Jane Cooper",
      username: "@jane",
      email: "jessica.hanson@example.com",
      position: "UI",
      status: "Active" as const,
      date: "5/27/15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Wade Warren",
      username: "@wade456",
      email: "willie.jennings@example.com",
      position: "UI/Ux",
      status: "Active" as const,
      date: "5/19/12",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Esther Howard",
      username: "@esther",
      email: "d.chambers@example.com",
      position: "UI/Ux",
      status: "Offline" as const,
      date: "3/4/16",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Jenny Wilson",
      username: "@jenny",
      email: "willie.jennings@example.com",
      position: "UI/Ux",
      status: "Offline" as const,
      date: "3/4/16",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Guy Hawkins",
      username: "@guy",
      email: "michael.mitc@example.com",
      position: "UI/Ux",
      status: "Wait" as const,
      date: "7/27/13",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6",
      name: "Jacob Jones",
      username: "@jacob",
      email: "michael.mitc@example.com",
      position: "UI/Ux",
      status: "Offline" as const,
      date: "5/27/15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "7",
      name: "Ronald Richards",
      username: "@ronald",
      email: "deanna.curtis@example.com",
      position: "UI/Ux",
      status: "Active" as const,
      date: "7/11/19",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "8",
      name: "Devon Lane",
      username: "@devon",
      email: "alma.lawson@example.com",
      position: "UI/Ux",
      status: "Wait" as const,
      date: "9/23/16",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "9",
      name: "Jerome Bell",
      username: "@jerome",
      email: "tanya.hill@example.com",
      position: "UI/Ux",
      status: "Wait" as const,
      date: "8/2/19",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Filter data based on search and status
  let filteredData = mockData

  if (filters.search) {
    filteredData = filteredData.filter(
      (employee) =>
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.username.toLowerCase().includes(filters.search.toLowerCase()),
    )
  }

  if (filters.status && filters.status !== "all") {
    filteredData = filteredData.filter((employee) => employee.status.toLowerCase() === filters.status.toLowerCase())
  }

  // Pagination
  const startIndex = (filters.page - 1) * filters.limit
  const endIndex = startIndex + filters.limit
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    total: filteredData.length,
    page: filters.page,
    limit: filters.limit,
  }
}

export const useGetEmployees = (filters: EmployeeFilters) => {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: () => empApi.getEmp(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAddEmployee = ()=>{
  const toast = useToast()
  return useMutation({
    mutationFn: (payload : createEmpPayload)=>empApi.createEmp(payload),
    onSuccess: (data : any) =>{
      // Handle success - could show toast or redirect
    },onError:(err : any)=>{
      toast.error("Oh ops!" , HandleError(err))
    }
  })
}