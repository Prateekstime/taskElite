"use client"

import { Suspense } from "react"
import { getUser } from "@/lib/auth"
import { FilteredUserTasks } from "@/components/filtered-user-tasks"
import { FilteredAdminTasks } from "@/components/filtered-admin-tasks"
import { TasksSkeleton } from "@/components/tasks-skeleton"

export default function TasksPage() {
  const user = getUser()
  console.log(user)

  return (
    <Suspense fallback={<TasksSkeleton />}>
   
      {user?.role === "admin" ? <FilteredAdminTasks /> : <FilteredUserTasks />}
    </Suspense>
  )
}
