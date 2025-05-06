// components/ThemeToggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevents hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon" 
      className='transition-all duration-1000 border-none '
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-8 w-8 bg-yellow-500 rounded-f" />
      ) : (
        <Moon className="h-8 w-8" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
