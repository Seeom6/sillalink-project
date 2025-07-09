"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data
const data = [
  { name: "Jan", users: 4000 },
  { name: "Feb", users: 3000 },
  { name: "Mar", users: 5000 },
  { name: "Apr", users: 8000 },
  { name: "May", users: 6000 },
  { name: "Jun", users: 8500 },
]

export function UserLineChart() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888" }} />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#6B2C91"
            strokeWidth={3}
            dot={{
              fill: "#fff",
              stroke: "#6B2C91",
              strokeWidth: 2,
              r: 6,
            }}
            activeDot={{
              fill: "#6B2C91",
              stroke: "#fff",
              strokeWidth: 2,
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
