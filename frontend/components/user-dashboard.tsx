"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { getUser } from "@/lib/auth"
import { tasks } from "@/constants/tasks.json"
import { TaskCard } from "@/components/task-card"
import { DailyTasks } from "@/components/daily-tasks"
import { ApexTasksOverviewChart } from "@/components/apex-tasks-overview-chart"
import { ProjectsProgress } from "@/components/projects-progress"
import { ApexTaskCompletionChart } from "@/components/apex-task-completion-chart"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/task-dialog"

export function UserDashboard() {
  const user = getUser()
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [taskColumns, setTaskColumns] = useState({
    todo: tasks.filter((task) => task.assignedTo === user?.id && task.status === "todo"),
    inProgress: tasks.filter((task) => task.assignedTo === user?.id && task.status === "inProgress"),
    completed: tasks.filter((task) => task.assignedTo === user?.id && task.status === "completed"),
  })

  const handleDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) return

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Get source and destination columns
    const sourceColumn = taskColumns[source.droppableId as keyof typeof taskColumns]
    const destColumn = taskColumns[destination.droppableId as keyof typeof taskColumns]

    // Same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn)
      const [removed] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, removed)

      setTaskColumns({
        ...taskColumns,
        [source.droppableId]: newTasks,
      })
    }
    // Different column
    else {
      const sourceTasks = Array.from(sourceColumn)
      const destTasks = Array.from(destColumn)
      const [removed] = sourceTasks.splice(source.index, 1)

      // Update task status based on the destination column
      const updatedTask = {
        ...removed,
        status: destination.droppableId,
      }

      destTasks.splice(destination.index, 0, updatedTask)

      setTaskColumns({
        ...taskColumns,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks,
      })
    }
  }

  const totalTasks = Object.values(taskColumns).flat().length
  const completedTasks = taskColumns.completed.length
  const inProgressTasks = taskColumns.inProgress.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Good morning, {user?.name}!</h1>
          <p className="text-gray-500 mt-1">Every task you complete is a step closer to your goals.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold">03</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <span className="flex items-center gap-2">Daily Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyTasks />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ApexTasksOverviewChart />
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
            <ProjectsProgress />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tasks Board</CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-500">To Do</h3>
                  <Droppable droppableId="todo">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-50 p-3 rounded-md min-h-[200px]"
                      >
                        {taskColumns.todo.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                              >
                                <TaskCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-500">In Progress</h3>
                  <Droppable droppableId="inProgress">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-50 p-3 rounded-md min-h-[200px]"
                      >
                        {taskColumns.inProgress.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                              >
                                <TaskCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-500">Completed</h3>
                  <Droppable droppableId="completed">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-50 p-3 rounded-md min-h-[200px]"
                      >
                        {taskColumns.completed.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                              >
                                <TaskCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      <TaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
    </div>
  )
}
