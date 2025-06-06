"use client"

import { useEffect, useState } from "react"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { apiClient } from "@/utils/FetchNodeServices"
import { useSearchParams } from "next/navigation"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (e: any, value: number) => {
    setPage(value);
  };


  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      const res = await apiClient(
        "GET",
        `/api/product/search?query=${query}&page=${page}&limit=6`,
        null
      )
      setProducts(res?.data || [])
      setTotalPages(res.totalPages)

    } catch (err) {
      console.error("Failed to fetch products", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    

    fetchProducts()
  }, [query])

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
            <p className="text-muted-foreground">
              {products.length} results for "{query}"
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <ProductSort />
          </div>
        </div>
        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div className="hidden md:block">
            <ProductFilters />
          </div>
          {loading ? (
            <ProductSkeletons count={6} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No products found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button asChild className="mt-4">
                <a href="/products">View all products</a>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#1976d2',
                  borderColor: '#1976d2',
                },
                '& .Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  borderColor: '#1976d2',
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: '#e3f2fd',
                },
              }}
            />
          </Stack>
        </div>    </div>
  )
}

function ProductSkeletons({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
    </div>
  )
}
