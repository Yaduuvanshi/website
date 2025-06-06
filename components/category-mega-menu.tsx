"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { apiClient } from "@/utils/FetchNodeServices"

interface SubCategory {
  _id?: string
  name: string
  href: string
}

interface Category {
  _id?: string
  name: string
  href: string
  subCategories: SubCategory[]
}


export function CategoryMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const fetchCategory = async () => {
    try {
      const response = await apiClient("GET", `/api/category`)
      if(response.ok)
      {
        setCategories(response.data)
      }else{
        alert(response.message)
      }
    } catch (error: any) {
      console.error(error);
    }
  }
  useEffect(function(){
    fetchCategory()
  },[])
  const handleCategoryHover = async(id: string) => {
    setActiveCategory(id)
    try {
      const response = await apiClient("GET", `/api/subCategory/${id}`)
      if(response.ok)
      {
        setSubCategories(response.data)
      }else{
        alert(response.message)
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const handleMouseLeave = () => {
    setActiveCategory(null)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <div className="container border-b">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <div
              key={category?.name}
              className="relative py-2 px-3"
              onMouseEnter={() => category?._id && handleCategoryHover(category._id)}
            >
              <button className="flex items-center text-sm font-medium whitespace-nowrap">
                {category?.name}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeCategory && (
        <div className="absolute left-0 right-0 z-50 bg-background border-b shadow-lg" onMouseLeave={handleMouseLeave}>
          <div className="container py-6">
            <div className="grid grid-cols-4 gap-6">
              {subCategories.map((subCategory) => (
                  <Link
                    key={subCategory?.name}
                    href={`/subCategory/${subCategory?._id}`}
                    className="text-sm hover:text-primary hover:underline"
                    onClick={() => setActiveCategory(null)}
                  >
                    {subCategory?.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
