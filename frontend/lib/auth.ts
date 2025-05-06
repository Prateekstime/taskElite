// This is a simple client-side auth implementation for demo purposes
// In a real app, you would use a proper auth solution like NextAuth.js

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

// Store user in localStorage
export const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Get user from localStorage
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

// Remove user from localStorage
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }
}


export const setToken = (token : any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", JSON.stringify(token))
  }

}


export const getToken = (): any | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    return token ? JSON.parse(token) : null

  }
  return null
}
