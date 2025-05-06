"use client"


import { Suspense } from "react"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Achievements } from "@/components/achievements"
import { AchievementsSkeleton } from "@/components/achievements-skeleton"

export default function AchievementsPage() {
  const user = getUser()

  if (user?.role === "admin") {
    redirect("/dashboard")
  }

  return (
    <Suspense fallback={<AchievementsSkeleton />}>
      <Achievements />
    </Suspense>
  )
}
