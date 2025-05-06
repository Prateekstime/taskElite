"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { users } from "@/constants/users.json"

export interface TaskFilters {
  status: string[]
  priority: string[]
  assignedTo: string[]
  dueDate: string
}

interface TaskFiltersProps {
  filters: TaskFilters
  onFilterChange: (filters: TaskFilters) => void
}

export function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStatusChange = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]

    onFilterChange({ ...filters, status: newStatuses })
  }

  const handlePriorityChange = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority]

    onFilterChange({ ...filters, priority: newPriorities })
  }

  const handleAssigneeChange = (userId: string) => {
    const newAssignees = filters.assignedTo.includes(userId)
      ? filters.assignedTo.filter((a) => a !== userId)
      : [...filters.assignedTo, userId]

    onFilterChange({ ...filters, assignedTo: newAssignees })
  }

  const handleDueDateChange = (value: string) => {
    onFilterChange({ ...filters, dueDate: value })
  }

  const clearFilters = () => {
    onFilterChange({
      status: [],
      priority: [],
      assignedTo: [],
      dueDate: "",
    })
  }

  const activeFilterCount =
    filters.status.length + filters.priority.length + filters.assignedTo.length + (filters.dueDate ? 1 : 0)

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Filter Tasks</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Status</h5>
              <div className="flex flex-wrap gap-2">
                {["todo", "inProgress", "completed"].map((status) => (
                  <Badge
                    key={status}
                    variant={filters.status.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusChange(status)}
                  >
                    {status === "inProgress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h5 className="text-sm font-medium mb-2">Priority</h5>
              <div className="flex flex-wrap gap-2">
                {["low", "medium", "high"].map((priority) => (
                  <Badge
                    key={priority}
                    variant={filters.priority.includes(priority) ? "default" : "outline"}
                    className={`cursor-pointer ${filters.priority.includes(priority) ? "" : "hover:bg-gray-100"}`}
                    onClick={() => handlePriorityChange(priority)}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h5 className="text-sm font-medium mb-2">Assigned To</h5>
              <div className="flex flex-wrap gap-2">
                {users
                  .filter((user) => user.role === "user")
                  .map((user) => (
                    <Badge
                      key={user.id}
                      variant={filters.assignedTo.includes(user.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleAssigneeChange(user.id)}
                    >
                      {user.name}
                    </Badge>
                  ))}
              </div>
            </div>

            <Separator />

            <div>
              <h5 className="text-sm font-medium mb-2">Due Date</h5>
              <Select value={filters.dueDate} onValueChange={handleDueDateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
