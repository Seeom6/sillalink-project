"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui/table"
import { Badge } from "../../../shared/ui/badge"

// Sample data
const projects = [
  {
    id: 1,
    manager: "En.Anas",
    date: "Jun 24, 2025",
    amount: "$942.00",
    status: "In Progress",
  },
  {
    id: 2,
    manager: "En.Anas",
    date: "Mar 10, 2025",
    amount: "$881.00",
    status: "Complete",
  },
  {
    id: 3,
    manager: "En.Anas",
    date: "Nov 10, 2025",
    amount: "$409.00",
    status: "Pending",
  },
  {
    id: 4,
    manager: "En.Anas",
    date: "Dec 20, 2025",
    amount: "$953.00",
    status: "Approved",
  },
  {
    id: 5,
    manager: "En.Anas",
    date: "Jul 25, 2025",
    amount: "$907.00",
    status: "Rejected",
  },
]

export function ProjectsTable() {
  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
            {status}
          </Badge>
        )
      case "Complete":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
            {status}
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
            {status}
          </Badge>
        )
      case "Approved":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50">
            {status}
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 hover:bg-gray-50">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[100px]">Manager</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="bg-gray-50/30">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                  {project.manager}
                </div>
              </TableCell>
              <TableCell>{project.date}</TableCell>
              <TableCell>{project.amount}</TableCell>
              <TableCell>{getStatusBadge(project.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
