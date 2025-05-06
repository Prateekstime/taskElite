"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { tasks } from "@/constants/tasks.json"
import { getUser } from "@/lib/auth"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function ApexTasksOverviewChart() {
  const user = getUser()
  const [mounted, setMounted] = useState(false)

  // For admin, show all tasks; for user, show only their tasks
  const filteredTasks = user?.role === "admin" ? tasks : tasks.filter((task) => task.assignedTo === user?.id)

  // Count tasks by status for each month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  const lastSixMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)

  const completedData = lastSixMonths.map((month) => {
    return filteredTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toLocaleString("en-US", { month: "short" }) === month && task.status === "completed"
    }).length
  })

  const inProgressData = lastSixMonths.map((month) => {
    return filteredTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toLocaleString("en-US", { month: "short" }) === month && task.status === "inProgress"
    }).length
  })

  const todoData = lastSixMonths.map((month) => {
    return filteredTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toLocaleString("en-US", { month: "short" }) === month && task.status === "todo"
    }).length
  })

  const series = [
    {
      name: "Completed",
      data: completedData,
    },
    {
      name: "In Progress",
      data: inProgressData,
    },
    {
      name: "Todo",
      data: todoData,
    },
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
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
      categories: lastSixMonths,
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
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </Card>
  )
}
