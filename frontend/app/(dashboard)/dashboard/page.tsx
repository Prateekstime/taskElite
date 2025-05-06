"use client"

import { Suspense } from "react"
import { getUser } from "@/lib/auth"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function DashboardPage() {
  const user = getUser()

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </Suspense>
  )
}
