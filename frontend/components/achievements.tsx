"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/auth"
import { tasks } from "@/constants/tasks.json"
import { Award, Calendar, CheckCircle, Clock, Target, Trophy } from "lucide-react"

export function Achievements() {
  const user = getUser()

  // Filter tasks for the current user
  const userTasks = tasks.filter((task) => task.assignedTo === user?.id)

  // Calculate statistics
  const completedTasks = userTasks.filter((task) => task.status === "completed").length
  const totalTasks = userTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate on-time completion rate
  const onTimeCompletions = userTasks.filter((task) => {
    if (task.status !== "completed") return false

    const dueDate = new Date(task.dueDate)
    const completedDate = new Date(task.completedDate || Date.now())
    return completedDate <= dueDate
  }).length

  const onTimeRate = completedTasks > 0 ? Math.round((onTimeCompletions / completedTasks) * 100) : 0

  // Calculate streak (consecutive days with completed tasks)
  const streak = 5 // Placeholder - would calculate from actual data

  // Achievements data
  const achievements = [
    {
      id: "first-task",
      title: "First Task Completed",
      description: "Completed your first task on the platform",
      icon: CheckCircle,
      earned: completedTasks > 0,
      date: "2023-04-15",
    },
    {
      id: "perfect-week",
      title: "Perfect Week",
      description: "Completed all assigned tasks for a week",
      icon: Calendar,
      earned: completedTasks >= 5,
      date: "2023-05-02",
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Completed 5 tasks before their deadlines",
      icon: Clock,
      earned: onTimeCompletions >= 5,
      date: "2023-05-10",
    },
    {
      id: "overachiever",
      title: "Overachiever",
      description: "Completed 10 tasks in a single month",
      icon: Target,
      earned: completedTasks >= 10,
      date: "2023-06-28",
    },
    {
      id: "team-player",
      title: "Team Player",
      description: "Collaborated on 3 team projects",
      icon: Trophy,
      earned: false,
      date: null,
    },
    {
      id: "master",
      title: "Task Master",
      description: "Maintained a 90% on-time completion rate",
      icon: Award,
      earned: onTimeRate >= 90 && completedTasks >= 10,
      date: null,
    },
  ]

  // Count earned achievements
  const earnedAchievements = achievements.filter((a) => a.earned).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Achievements</h1>
        <p className="text-gray-500 mt-1">Track your progress and accomplishments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <Card className="bg-white  dark:bg-slate-800 dark:text-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Achievements Earned</p>
              <p className="text-3xl font-bold">
                {earnedAchievements}/{achievements.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white  dark:bg-slate-800 dark:text-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-3xl font-bold">{completionRate}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white  dark:bg-slate-800 dark:text-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-3xl font-bold">{streak} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <achievement.icon
                      className={`h-5 w-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{achievement.title}</h3>
                      {achievement.earned ? (
                        <Badge className="bg-green-100 text-green-800">Earned</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">In Progress</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-gray-400 mt-1">Earned on {achievement.date}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
