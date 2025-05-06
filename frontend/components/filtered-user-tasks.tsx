
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { getUser } from "@/lib/auth"
import { tasks } from "@/constants/tasks.json"
import { TaskCard } from "@/components/task-card"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/task-dialog"
import { TaskFilters, type TaskFilters as TaskFiltersType } from "@/components/task-filters"
import { Input } from "@/components/ui/input"

export function FilteredUserTasks() {
  const user = getUser()
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: [],
    priority: [],
    assignedTo: [],
    dueDate: "",
  })

  const [taskColumns, setTaskColumns] = useState({
    todo: tasks.filter((task) => task.assignedTo === user?.id && task.status === "todo"),
    inProgress: tasks.filter((task) => task.assignedTo === user?.id && task.status === "inProgress"),
    completed: tasks.filter((task) => task.assignedTo === user?.id && task.status === "completed"),
  })

  // Apply filters and search
  useEffect(() => {
    const userTasks = tasks.filter((task) => task.assignedTo === user?.id)

    // Apply search
    let filteredTasks = userTasks
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredTasks = filteredTasks.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filteredTasks = filteredTasks.filter((task) => filters.status.includes(task.status))
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filteredTasks = filteredTasks.filter((task) => filters.priority.includes(task.priority))
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

      filteredTasks = filteredTasks.filter((task) => {
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

    // Update task columns
    setTaskColumns({
      todo: filteredTasks.filter((task) => task.status === "todo"),
      inProgress: filteredTasks.filter((task) => task.status === "inProgress"),
      completed: filteredTasks.filter((task) => task.status === "completed"),
    })
  }, [searchQuery, filters, user?.id])

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and organize your tasks</p>
        </div>
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
                      className="bg-gray-50 p-3 rounded-md min-h-[500px]"
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
                      className="bg-gray-50 p-3 rounded-md min-h-[500px]"
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
                      className="bg-gray-50 p-3 rounded-md min-h-[500px]"
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

      <TaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
    </div>
  )
}
