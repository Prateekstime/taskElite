"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { tasks } from "@/constants/tasks.json"
import { users } from "@/constants/users.json"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

// Declare ApexCharts type
declare global {
  interface Window {
    ApexCharts: any
  }
}

export function ApexUserProductivityChart() {
  const [mounted, setMounted] = useState(false)

  // Only include regular users, not admins
  const regularUsers = users.filter((user) => user.role === "user")

  const userData = regularUsers.map((user) => {
    const userTasks = tasks.filter((task) => task.assignedTo === user.id)

    return {
      name: user.name,
      completed: userTasks.filter((task) => task.status === "completed").length,
      inProgress: userTasks.filter((task) => task.status === "inProgress").length,
      todo: userTasks.filter((task) => task.status === "todo").length,
    }
  })

  const series = [
    {
      name: "Completed",
      data: userData.map((user) => user.completed),
    },
    {
      name: "In Progress",
      data: userData.map((user) => user.inProgress),
    },
    {
      name: "Todo",
      data: userData.map((user) => user.todo),
    },
  ]

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: userData.map((user) => user.name),
    },
    yaxis: {
      title: {
        text: "Tasks",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => val + " tasks",
      },
    },
    colors: ["#4ade80", "#60a5fa", "#d1d5db"],
    legend: {
      position: "top",
    },
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>

  return (
    <Card className="w-full h-[300px]">
      <ReactApexChart options={options as ApexCharts.ApexOptions} series={series} type="bar" height={300} />
    </Card>
  )
}
