"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { users } from "@/constants/users.json"
import { setUser } from "@/lib/auth"
// import { register } from "module"

export default function RegistrationPage() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: `https://avatar.iran.liara.run/username?username=${user?.name}`,

      })
      router.push("/login")
    }
    else if( password != confirmPassword){
       setError("Password didn't Matched")

    } else {
      setError("Try Strong password")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pen-tool"
              >
                <path d="m12 19 7-7 3 3-7 7-3-3z" />
                <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="m2 2 7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">TaskElite</CardTitle>
          </div>
          <CardDescription>Enter your credentials to go on Login page</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegistration}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
            <div className="space-y-2">
            <Label htmlFor="email">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Button variant="link" className="p-0 h-auto text-xs">
                  Forgot password?
                </Button> */}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                {/* <Button variant="link" className="p-0 h-auto text-xs">
                  Forgot password?
                </Button> */}
              </div>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" >
              Register
            </Button>

              <p  className={`mt-4  ${
                      email && password 
                        ? 'hidden transition-all duration-1000'
                        : ' font-extralight text-xs transition-all duration-1000  ' 
                        
                    } text-gray transition-colors`}>Alrady Registered </p>
                        <Button
                    type="submit"
                    className={`w-full   ${
                     email || password || fullName
                        ? ' bg-black-900 transition-all duration-1000 '
                        : ' w-full transition-all duration-700  ' 
                        
                    } text-white py-2 px-4 rounded transition-colors`}
                    onClick={()=>{ router.push("/login")}}
                  >
                    Login
                  </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
