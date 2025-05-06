"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { tasks } from "@/constants/tasks.json"
import { getUser } from "@/lib/auth"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

// Declare ApexCharts
declare var ApexCharts: any

export function ApexTaskCompletionChart() {
  const user = getUser()
  const [mounted, setMounted] = useState(false)

  // Filter tasks for the current user if not admin
  const filteredTasks = user?.role === "admin" ? tasks : tasks.filter((task) => task.assignedTo === user?.id)

  // Get the last 14 days
  const getDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date)
    }

    return dates
  }

  const dates = getDates()

  // Format dates for display
  const formattedDates = dates.map((date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

  // Count completed tasks per day
  const completedTasksData = dates.map((date) => {
    const dateString = date.toISOString().split("T")[0]

    return filteredTasks.filter((task) => {
      if (!task.completedDate) return false
      const taskDate = new Date(task.completedDate)
      return taskDate.toISOString().split("T")[0] === dateString
    }).length
  })

  const series = [
    {
      name: "Completed Tasks",
      data: completedTasksData,
    },
  ]

  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: formattedDates,
    },
    yaxis: {
      title: {
        text: "Tasks Completed",
      },
    },
    tooltip: {
      x: {
        format: "dd MMM",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    colors: ["#3b82f6"],
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>

  return (
    <Card className="w-full h-[300px]">
      <ReactApexChart options={options as ApexCharts.ApexOptions} series={series} type="area" height={300} />
    </Card>
  )
}
