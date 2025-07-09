"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data
const data = [
  { name: "Aug", value: 8000 },
  { name: "Sep", value: 10000 },
  { name: "Oct", value: 9000 },
  { name: "Nov", value: 7000 },
  { name: "Dec", value: 12500, highlight: true },
  { name: "Jan", value: 6000 },
]

export function ExpensesBarChart() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
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
            formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]} className="fill-[#16DBCC]"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
// fill={(data) => (data.highlight ? "#10b981" : "#e2e8f0")} 