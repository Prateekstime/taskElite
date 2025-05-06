"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { projects } from "@/constants/projects.json"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function ApexProjectsProgressChart() {
  const [mounted, setMounted] = useState(false)

  const series = projects.map((project) => project.progress)

  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "50%",
        },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Average",
            formatter: () => {
              const avg = Math.round(series.reduce((a, b) => a + b, 0) / series.length)
              return avg + "%"
            }
          },
        },
        track: {
          background: "#f1f5f9",
          strokeWidth: "97%",
          margin: 5,
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: projects.map((project) => project.name),
    colors: ["#3b82f6", "#8b5cf6", "#10b981"],
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>

  return (
    <Card className="w-full h-[300px]  dark:bg-slate-800 dark:text-white">
      {mounted && ReactApexChart && (
        <ReactApexChart options={options as ApexCharts.ApexOptions} series={series} type="radialBar" height={300} />
      )}
    </Card>
  )
}
