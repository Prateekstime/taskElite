"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { users } from "@/constants/users.json"
import { CalendarDays } from "lucide-react"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    assignedTo: string
    dueDate: string
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const user = users.find((user) => user.id === task.assignedTo)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-800 dark:text-white">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium">{task.title}</h3>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name}`} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <CalendarDays className="h-3 w-3 mr-1" />
              {task.dueDate}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
