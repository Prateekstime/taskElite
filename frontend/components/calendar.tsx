"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { tasks } from "@/constants/tasks.json"
import { getUser } from "@/lib/auth"

export function Calendar() {
  const user = getUser()
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthName = currentDate.toLocaleString("default", { month: "long" })

  // Filter tasks for the current user if not admin
  const filteredTasks = user?.role === "admin" ? tasks : tasks.filter((task) => task.assignedTo === user?.id)

  // Get tasks for a specific day
  const getTasksForDay = (day: number) => {
    return filteredTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.getDate() === day && taskDate.getMonth() === month && taskDate.getFullYear() === year
    })
  }

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Calculate rows needed (ceil to account for partial rows)
  const rows = Math.ceil(calendarDays.length / 7)

  // Ensure we have complete rows (7 days per row)
  while (calendarDays.length < rows * 7) {
    calendarDays.push(null)
  }

  // Split into rows
  const calendarRows = []
  for (let i = 0; i < rows; i++) {
    calendarRows.push(calendarDays.slice(i * 7, (i + 1) * 7))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between  dark:bg-slate-800 dark:text-white ">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {monthName} / {year}
          </div>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-white  dark:bg-slate-800 dark:text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Monthly View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {calendarRows.map((row, rowIndex) =>
              row.map((day, colIndex) => {
                const isToday =
                  day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

                const dayTasks = day ? getTasksForDay(day) : []

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`min-h-[100px] p-1 border  dark:bg-slate-900 dark:text-white ${
                      isToday ? "bg-blue-50 border-blue-200   dark:bg-slate-500 dark:text-white" : "border-gray-100"
                    } ${day === null ? "bg-gray-50 dark:bg-slate-800" : ""}`}
                  >
                    {day !== null && (
                      <>
                        <div className={`text-right p-1 ${isToday ? "font-bold text-blue-600 dark:text-slate-300" : ""}`}>{day}</div>
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className={`text-xs p-1 rounded truncate ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-center text-gray-500">+{dayTasks.length - 3} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              }),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
