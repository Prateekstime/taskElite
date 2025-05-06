"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { tasks } from "@/constants/tasks.json"
import { projects } from "@/constants/projects.json"
import { users } from "@/constants/users.json"

interface SearchResult {
  id: string
  title: string
  type: "task" | "project" | "user"
  url: string
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()

    // Search in tasks
    const taskResults = tasks
      .filter((task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query))
      .map((task) => ({
        id: task.id,
        title: task.title,
        type: "task" as const,
        url: "/tasks",
      }))

    // Search in projects
    const projectResults = projects
      .filter(
        (project) => project.name.toLowerCase().includes(query) || project.description.toLowerCase().includes(query),
      )
      .map((project) => ({
        id: project.id,
        title: project.name,
        type: "project" as const,
        url: "/projects",
      }))

    // Search in users
    const userResults = users
      .filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
      .map((user) => ({
        id: user.id,
        title: user.name,
        type: "user" as const,
        url: "/users",
      }))

    setSearchResults([...taskResults, ...projectResults, ...userResults].slice(0, 5))
  }, [searchQuery])

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks, projects, users..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 max-h-80 overflow-auto">
          <div className="p-2">
            {searchResults.map((result) => (
              <Button
                key={`${result.type}-${result.id}`}
                variant="ghost"
                className="w-full justify-start text-left mb-1 h-auto py-2"
                onClick={() => handleResultClick(result)}
              >
                <div>
                  <div className="font-medium">{result.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{result.type}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
