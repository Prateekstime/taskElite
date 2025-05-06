"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreVertical, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { tasks } from "@/constants/tasks.json"
import { getUser } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DailyTasks() {
  const user = getUser()
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`
  }

  // Filter tasks for the current user and date
  const dailyTasks = tasks
    .filter((task) => task.assignedTo === user?.id)
    .filter((task) => {
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === currentDate.getDate() &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      )
    })
    .sort((a, b) => {
      const timeA = a.startTime || "09:00"
      const timeB = b.startTime || "09:00"
      return timeA.localeCompare(timeB)
    })

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  return (
    <div className="space-y-4 dark:bg-slate-900 dark:text-zinc-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">{formatDate(currentDate)}</span>
          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {dailyTasks.length > 0 ? (
          dailyTasks.map((task) => (
            <div key={task.id} className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="w-16 text-sm text-gray-500">{formatTime(task.startTime || "09:00")}</div>
              <div className="flex-1">
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No tasks scheduled for today</div>
        )}
      </div>
    </div>
  )
}
