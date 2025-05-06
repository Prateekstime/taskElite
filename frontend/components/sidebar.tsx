"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getUser, logout } from "@/lib/auth"
import { LayoutDashboard, CheckSquare, FolderKanban, CalendarIcon, Award, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
// import { UserSetting } from "@/components/userSetting"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const user = getUser()
  const isAdmin = user?.role === "admin"


  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    // { name: "UserSetting", href: "/setting", icon: FolderKanban },
    ...(!isAdmin ? [
      { name: "Calendar", href: "/calendar", icon: CalendarIcon },
      { name: "Achievements", href: "/achievements", icon: Award },
    ] : [])
  ]

  return (
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200  dark:bg-slate-950 dark:text-white">
        {/* Logo */}
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="m12 19 7-7 3 3-7 7-3-3z" />
                <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="m2 2 7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <span className="text-xl font-bold">TaskElite</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3 space-y-1">
          {links.map((link) => (
              <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      pathname === link.href ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100  dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2 ">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3"  onClick={()=>{router.push("/settings")}}>
            <Settings className="w-5 h-5"  />
            Setting
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-red-500 hover:text-red-600  hover:bg-red-50">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to logout of your account?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
  )
}