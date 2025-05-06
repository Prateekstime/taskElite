"use client"

import { useState } from "react"
import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUser } from "@/lib/auth"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/themeToggle"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, DialogTrigger,
} from "@/components/ui/dialog"

export function Header() {
  const user = getUser()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar */}
          <div className={`${isSearchOpen ? "flex" : "hidden md:flex"} items-center flex-1 max-w-xl mx-auto`}>
            <SearchBar />
            <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Side Icons */}
          {!isSearchOpen && (
              <div className="flex items-center gap-2 md:gap-4 ">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
                  <X className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" className="relative border-none">
                  <ThemeToggle />
                 
                </Button>

                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen} >
                  <DialogTrigger asChild>
                    <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Avatar>
                        <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name}`} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name}`} />
                          <AvatarFallback className="text-3xl">
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <DialogTitle className="text-xl">{user?.name}</DialogTitle>
                          <DialogDescription className="text-sm text-gray-500">
                            {user?.email}
                          </DialogDescription>
                          <div className="mt-2 text-sm">
                            <p>Role: <span className="font-medium capitalize">{user?.role}</span></p>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
          )}
        </div>
      </header>
  )
}