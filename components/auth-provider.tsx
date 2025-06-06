"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  register: (userData: Partial<User>) => Promise<boolean>
  loading: boolean
}



export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => false,
  signOut: () => {},
  register: async () => false,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid JSON found in localStorage for key 'user':", error);
        localStorage.removeItem("user"); // Galat data hata do
      }
    }
    setLoading(false);
  }, []);
  

  const signIn = async (email: string, password: string) => {
    try {
      // This would be an API call in a real app
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: "user123",
        firstName: "John",
        lastName: "Doe",
        email,
        phone: "123-456-7890",
        role: "customer",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const register = async (userData: Partial<User>) => {
    try {
      // This would be an API call in a real app
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: "user" + Math.floor(Math.random() * 1000),
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: "customer",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  return <AuthContext.Provider value={{ user, signIn, signOut, register, loading }}>{children}</AuthContext.Provider>
}
