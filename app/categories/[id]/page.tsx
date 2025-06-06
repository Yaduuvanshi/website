"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/utils/FetchNodeServices"

type SubCategory = {
  _id: string
  name: string
  description: string
  image: string
  products: string[]
}

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [category, setCategory] = useState<{ name: string; description: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchCategory = async () => {
    setLoading(true)
    try {
      const response = await apiClient("GET", `/api/category/${resolvedParams.id}`)
      console.log("response6666666666666666666",response?.data)
      if (response.ok) {
        const { name, description, subCategories } = response.data
        setCategory({ name, description })
        setSubCategories(subCategories)
      } else {
        alert(response.message)
      }
    } catch (error: any) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [resolvedParams.id])

  return (
    <div className="container px-4 md:px-6 py-6">
      <Link
        href="/categories"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Categories
      </Link>

      <div className="flex flex-col gap-4 md:gap-8">
        {loading || !category ? (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-96" />
          </>
        ) : (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <SubCategorySkeletons count={4} />
          ) : subCategories.length > 0 ? (
            subCategories.map((sub) => (
              <div key={sub._id} className="border rounded-lg overflow-hidden shadow-sm" onClick={() => router.push(`/subCategory/${sub._id}`)}>
                <img src={sub.image} alt={sub.name} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                  <p className="mt-2 text-sm font-medium">
                    {sub.products.length} product{sub.products.length !== 1 && "s"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-xl font-semibold">No subcategories found</h2>
              <p className="text-muted-foreground mt-2">
                This category currently has no subcategories. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SubCategorySkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </>
  )
}
