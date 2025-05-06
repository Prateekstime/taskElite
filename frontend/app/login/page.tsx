"use client"

import type React from "react"
import axios from 'axios'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { users } from "@/constants/users.json"
import { setUser, setToken } from "@/lib/auth"

export default function LoginPage() {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError(""); // Clear previous error
  
    const data = {
      email,
      password
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      const userData = response.data.user;
      const token = response.data.token;
      setToken(token);
     

     
  
      // Set the user from response
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: `https://avatar.iran.liara.run/username?username=${userData.name}`,
      });
  
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError("Invalid email or password");
    }
  };
  

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
            <CardTitle className="text-2xl font-bold dark:text-gray-500 dark:bg-black">TaskElite</CardTitle>
          </div>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
            <div className="space-y-2">
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
                <Button variant="link" className="p-0 h-auto text-xs">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <p  className={`mt-4  ${
          email && password 
            ? 'hidden transition-all duration-1000'
            : ' font-extralight text-xs transition-all duration-1000  ' 
            
        } text-gray transition-colors`}>If you are a New User! </p>
            <Button
        type="submit"
        className={`w-full   ${
          email && password 
            ? ' bg-black-900 transition-all duration-1000 '
            : ' w-full transition-all duration-700  ' 
            
        } text-white py-2 px-4 rounded transition-colors`}
        onClick={()=>{ router.push("/register")}}
      >
        Register
      </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
