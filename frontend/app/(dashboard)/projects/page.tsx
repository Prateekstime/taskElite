"use client"

import { Suspense } from "react"
import { ProjectsList } from "@/components/projects-list"
import { ProjectsSkeleton } from "@/components/projects-skeleton"

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsList />
    </Suspense>
  )
}
