"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { tasks } from "@/constants/tasks.json"
import { users } from "@/constants/users.json"
import { ApexTasksOverviewChart } from "@/components/apex-tasks-overview-chart"
import { ApexUserProductivityChart } from "@/components/apex-user-productivity-chart"
import { ApexProjectsProgressChart } from "@/components/apex-projects-progress-chart"
import { ApexTaskCompletionChart } from "@/components/apex-task-completion-chart"

export function AdminDashboard() {
  const totalTasks = tasks.length
  console.log("totalTasks:",totalTasks)
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress").length
  const pendingTasks = tasks.filter((task) => task.status === "todo").length

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
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor team performance and task progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-3xl font-bold">{inProgressTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-3xl font-bold">{pendingTasks}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ApexTasksOverviewChart />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">User Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <ApexUserProductivityChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Task Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ApexTaskCompletionChart />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Projects Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ApexProjectsProgressChart />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Tasks</CardTitle>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.slice(0, 5).map((task) => {
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
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
