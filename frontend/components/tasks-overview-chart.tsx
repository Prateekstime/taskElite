"use client"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { tasks } from "@/constants/tasks.json"
import { getUser } from "@/lib/auth"

export function TasksOverviewChart() {
  const user = getUser()

  // For admin, show all tasks; for user, show only their tasks
  const filteredTasks = user?.role === "admin" ? tasks : tasks.filter((task) => task.assignedTo === user?.id)

  // Count tasks by status for each month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  const data = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month) => {
    const monthTasks = filteredTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toLocaleString("en-US", { month: "short" }) === month
    })

    return {
      name: month,
      Completed: monthTasks.filter((task) => task.status === "completed").length,
      "In Progress": monthTasks.filter((task) => task.status === "inProgress").length,
      Todo: monthTasks.filter((task) => task.status === "todo").length,
    }
  })

  return (
    <Card className="w-full h-[300px]  dark:bg-slate-800 dark:text-white">
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
            <Bar dataKey="Completed" stackId="a" fill="#4ade80" />
            <Bar dataKey="In Progress" stackId="a" fill="#60a5fa" />
            <Bar dataKey="Todo" stackId="a" fill="#d1d5db" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
