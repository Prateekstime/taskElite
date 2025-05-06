"use client"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { tasks } from "@/constants/tasks.json"
import { users } from "@/constants/users.json"

export function UserProductivityChart() {
  // Only include regular users, not admins
  const regularUsers = users.filter((user) => user.role === "user")

  const data = regularUsers.map((user) => {
    const userTasks = tasks.filter((task) => task.assignedTo === user.id)

    return {
      name: user.name,
      Completed: userTasks.filter((task) => task.status === "completed").length,
      "In Progress": userTasks.filter((task) => task.status === "inProgress").length,
      Todo: userTasks.filter((task) => task.status === "todo").length,
    }
  })

  return (
    <Card className="w-full h-[300px]">
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <ChartTooltipContent>
                        <div className="font-medium">{label}</div>
                        {payload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span>
                              {entry.name}: {entry.value}
                            </span>
                          </div>
                        ))}
                      </ChartTooltipContent>
                    </ChartTooltip>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Bar dataKey="Completed" fill="#4ade80" />
            <Bar dataKey="In Progress" fill="#60a5fa" />
            <Bar dataKey="Todo" fill="#d1d5db" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
