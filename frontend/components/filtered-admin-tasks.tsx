"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { tasks } from "@/constants/tasks.json"
import { users } from "@/constants/users.json"
import { Plus, MoreHorizontal } from "lucide-react"
import { TaskDialog } from "@/components/task-dialog"
import { TaskFilters, type TaskFilters as TaskFiltersType } from "@/components/task-filters"
import { Input } from "@/components/ui/input"
import {  getToken } from "@/lib/auth"
import axios from "axios"

export function FilteredAdminTasks() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: [],
    priority: [],
    assignedTo: [],
    dueDate: "",
  })
  const fetchTasks = async () => {
    const token = getToken()
    const response = await axios.get("http://localhost:5000/api/tasks/getTasks", {
      headers: {
        "Content-Type": "application/json",
        'Authorization': token,
      }
    
    });
    console.log(response.data)
  }
  
  useEffect(() => {
    fetchTasks()
    
  },[])

  const [filteredTasks, setFilteredTasks] = useState(tasks)

  // Apply filters and search
  useEffect(() => {
    // Apply search
    let result = tasks
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((task) => filters.status.includes(task.status))
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      result = result.filter((task) => filters.priority.includes(task.priority))
    }

    // Apply assignee filter
    if (filters.assignedTo.length > 0) {
      result = result.filter((task) => filters.assignedTo.includes(task.assignedTo))
    }

    // Apply due date filter
    if (filters.dueDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const nextMonth = new Date(today)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      result = result.filter((task) => {
        const taskDate = new Date(task.dueDate)
        taskDate.setHours(0, 0, 0, 0)

        switch (filters.dueDate) {
          case "today":
            return taskDate.getTime() === today.getTime()
          case "tomorrow":
            return taskDate.getTime() === tomorrow.getTime()
          case "week":
            return taskDate >= today && taskDate < nextWeek
          case "month":
            return taskDate >= today && taskDate < nextMonth
          default:
            return true
        }
      })
    }

    setFilteredTasks(result)
  }, [searchQuery, filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "inProgress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Tasks </h1>
          <p className="text-gray-500 mt-1">Manage and track all team tasks</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsTaskDialogOpen(true)}>
          {/* <Plus className="mr-2 h-4 w-4" /> */}
          Add Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <TaskFilters filters={filters} onFilterChange={setFilters} />
      </div>

      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const user = getUser(task.assignedTo)
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name}`} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === "inProgress"
                            ? "In Progress"
                            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Task</DropdownMenuItem>
                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                            <DropdownMenuItem>Delete Task</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No tasks found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
    </div>
  )
}
