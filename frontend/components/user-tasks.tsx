"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { getUser } from "@/lib/auth"
import { tasks } from "@/constants/tasks.json"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"

export function UserTasks() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and organize your tasks</p>
        </div>
      </div>

      <Card className="bg-white  dark:bg-slate-800 dark:text-white">
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
