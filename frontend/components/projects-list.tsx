"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projects } from "@/constants/projects.json"
import { users } from "@/constants/users.json"
import { Plus } from "lucide-react"
import {getUser} from "@/lib/auth";

export function ProjectsList() {
  const user = getUser()


  const getUserById= (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "inProgress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const visibleProjects = user
      ? user.role === "admin"
          ? projects
          : projects.filter(
              (project) =>
                  project.leadId === user.id ||
                  project.teamMembers.includes(user.id)
          )
      : []


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500 mt-1">Manage and track all projects</p>
        </div>
        {user?.role === 'admin' && <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4"/>
          New Project
        </Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProjects.map((project) => {
          const lead = getUserById(project.leadId)
          const teamMembers = project.teamMembers.map((id) => getUserById(id)).filter(Boolean)

          return (
            <Card key={project.id} className="bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        project.icon === "design"
                          ? "bg-purple-100"
                          : project.icon === "web"
                            ? "bg-blue-100"
                            : "bg-green-100"
                      }`}
                    >
                      {project.icon === "design" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-purple-600"
                        >
                          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                          <path d="M12 2v2" />
                          <path d="M12 22v-2" />
                          <path d="m17 20.66-1-1.73" />
                          <path d="M11 10.27 7 3.34" />
                          <path d="m20.66 17-1.73-1" />
                          <path d="m3.34 7 1.73 1" />
                          <path d="M14 12h8" />
                          <path d="M2 12h2" />
                          <path d="m20.66 7-1.73 1" />
                          <path d="m3.34 17 1.73-1" />
                          <path d="m17 3.34-1 1.73" />
                          <path d="m7 20.66 1-1.73" />
                        </svg>
                      ) : project.icon === "web" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600"
                        >
                          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                          <path d="M12 3v6" />
                        </svg>
                      )}
                    </div>
                    <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status === "inProgress"
                      ? "In Progress"
                      : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-500">{project.description}</p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Lead:</span>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://avatar.iran.liara.run/username?username=${lead?.name}`} alt={lead?.name} />
                        <AvatarFallback>{lead?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{lead?.name}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Due: {project.dueDate}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {teamMembers.slice(0, 4).map((user, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name}`} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {teamMembers.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                        +{teamMembers.length - 4}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
