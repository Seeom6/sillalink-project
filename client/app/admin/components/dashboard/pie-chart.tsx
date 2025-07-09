"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui/table"

// Sample data
const data = [
  { name: "United States", value: 6806, color: "#2563eb" },
  { name: "Canada", value: 2000, color: "#3b82f6" },
  { name: "Mexico", value: 3474, color: "#60a5fa" },
  { name: "Syria", value: 7307, color: "#93c5fd" },
  { name: "Arabian Gulf", value: 6264, color: "#bfdbfe" },
  { name: "Tunisia", value: 5482, color: "#dbeafe" },
  { name: "Morocco", value: 2728, color: "#eff6ff" },
]

export function TrafficPieChart() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">


      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.name}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={1} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`${value}`, "Value"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
