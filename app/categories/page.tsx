"use client"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/utils/FetchNodeServices"
import { toast } from "@/hooks/use-toast"

interface Category {
  _id: string
  name: string
  description: string
  image: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const fetchCategory=async()=>{
    try {
      const response = await apiClient("GET", `/api/category`)
      if(response.ok)
      {
        setCategories(response?.data)
      }else{
        toast({
          title: response?.message,
          description: "error",
        })
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  useEffect(()=>{
   fetchCategory()
  },[])
  

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gift Categories</h1>
          <p className="text-muted-foreground">Browse our collection of gift categories</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Suspense fallback={<CategorySkeletons count={8} />}>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="group relative flex flex-col overflow-hidden rounded-lg border"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={category.image || "/placeholder.svg?height=400&width=400"}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 p-4">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                  <div className="flex items-center pt-2">
                    <span className="text-sm font-medium text-primary inline-flex items-center">
                      Browse Category
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CategorySkeletons({ count }: { count: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
    </>
  )
}
