"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductGallery } from "@/components/product-gallery"
import { ProductVariantSelector } from "@/components/product-variant-selector"
import { ProductQuantitySelector } from "@/components/product-quantity-selector"
import { ProductReviews } from "@/components/product-reviews"
import { ProductAddToCart } from "@/components/product-add-to-cart"
import { ProductAddToWishlist } from "@/components/product-add-to-wishlist"
import { ProductCard } from "@/components/product-card"

import { useParams } from "next/navigation"
import { apiClient } from "@/utils/FetchNodeServices"
type ProductVariant = {
  _id: string
  title: string
  price: number
  stock: number
  description?: string
  descriptionsecond?: string
  images?: string[]
}

type Product = {
  id: string
  title: string
  description?: string
  images?: string[]
  variants: ProductVariant[]
  reviews: any[] 
}



export default function ProductPageClient() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const fetchSpecificProductByProductid = async () => {
    try {
      const res = await apiClient("GET", `/api/product/${id}`, null)
      const resRelatedProducts = await apiClient("GET", `/api/product?pagination=true&page=1&limit=4`, null)

      if (res.ok) {
        setProduct(res.data)
        setSelectedVariant(res.data.variants[0]) // default variant
      } else {
        console.error(res.message)
      }

      if (resRelatedProducts.ok) {
        setRelatedProducts(resRelatedProducts.data)
      } else {
        console.error(resRelatedProducts.message)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchSpecificProductByProductid()
  }, [id])

  if (!product || !selectedVariant) {
    return (
      <div className="container px-4 md:px-6 py-10">
        {/* Loading skeleton */}
        <ProductSkeletons count={4} />
      </div>
    )
  }

  console.log("SELECTED VARIENT:",selectedVariant)
  return (
    <div className="container px-4 md:px-6 py-6">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={
          selectedVariant?.images?.length
            ? selectedVariant.images
            : product?.images ?? []
        } />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{selectedVariant?.title?selectedVariant?.title+",":""}{product.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">(24 reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold">₹{selectedVariant.price.toFixed(2)}</div>
          <p className="text-muted-foreground">{selectedVariant.description || product.description}</p>
          <p className="text-sm text-muted-foreground">In Stock: {selectedVariant.stock}</p>

          <Separator />

          <ProductVariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariant._id}
            onVariantSelect={(variantId) => {
              const newVariant = product.variants.find((v) => v._id === variantId)
              if (newVariant) setSelectedVariant(newVariant)
            }}
          />

          <ProductQuantitySelector />
          <div className="flex flex-col sm:flex-row gap-2">
            <ProductAddToCart product={{ ...product }} selectedVariant={selectedVariant} />
            <ProductAddToWishlist product={product} />
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Product Details</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">

              {/* {product?.variants?.[0]?.descriptionsecond?.split(',')?.map((item: any, index: any) => (
                <li key={index}>{item}</li>
              ))} */}

              {selectedVariant?.descriptionsecond?.split(',')?.map((item: any, index: any) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-10" />
      <ProductReviews productId={id as string} />
      <Separator className="my-10" />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <ProductSkeletons count={4} />
          )}
        </div>
      </div>
    </div>
  )
}

function ProductSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
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
