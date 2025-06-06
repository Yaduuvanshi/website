"use client"
import { Suspense, useEffect, useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
// import { ProductSort } from "@/components/product-sort"
import { apiClient } from "@/utils/FetchNodeServices"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})

  const handlePageChange = (e: any, value: number) => {
    setPage(value)
  }

  const fetchProducts = async () => {
    try {
      const body = {
        ...filters,
        page,
        limit: 6
      }
      const res = await apiClient("POST", `/api/product/filter`, body)
      if (res.ok) {
        const data = res.data || []
        setTotalPages(res.totalPages || 1)
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products", error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, filters])

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <p className="text-muted-foreground">Browse our collection of unique and thoughtful gifts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {/* <ProductSort /> */}
          </div>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div className="hidden md:block">
            <ProductFilters setFilters={setFilters} setPage={setPage} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={<ProductSkeletons count={9} />}>
              {products.length > 0 ? (
                products.map((product:any) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <ProductSkeletons count={6} />
              )}
            </Suspense>
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
        </div>
      </div>
    </div>
  )
}

function ProductSkeletons({ count }: { count: number }) {
  return (
    <>
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
    </>
  )
}
