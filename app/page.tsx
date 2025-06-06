"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Gift, Search, ShoppingBag, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"
import { CategoryCard } from "@/components/category-card"
import { getFeaturedProducts } from "@/lib/api"
import { getCategories } from "@/lib/api"
import HeroSection from "@/components/hero-section"
import { apiClient } from "@/utils/FetchNodeServices"

export default function Home() {
  // const featuredProducts =  getFeaturedProducts()
  const [products ,setProducts]= useState([])
  const [giftforyou ,setGiftForYou] =useState([])
  // const categories = await getCategories()
   const [categories ,setCategories] = useState([])
    const fetchCategory=async()=>{
      try {
        const response = await apiClient("GET", `/api/category`)
        if(response.ok)
        {
          setCategories(response.data.slice(0, 5))
        }else{
          alert(response.message)
        }
      } catch (error: any) {
        console.error(error.message);
      }
    }

    const fetchProduct = async () => {
      try {
        const response = await apiClient("GET", `/api/product`);
        if (response.ok) {
          const giftProducts = response.data.filter((product: any) =>
            product.variants?.some((variant: any) => variant.isGift === true)
          );
          setGiftForYou(giftProducts.slice(0, 4));
    
          const withoutGiftProducts = response.data.filter((product: any) =>
            product.variants?.every((variant: any) => variant.isGift !== true)
          );
          setProducts(withoutGiftProducts.slice(0, 8));
        } else {
          alert(response.message);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };
    
  
    useEffect(()=>{
     fetchCategory()
     fetchProduct()
    },[])

  return (
    <div className="flex flex-col gap-10 pb-20">
      <HeroSection />

      {/* Search Section */}
      <section className="container px-4 md:px-6 py-6">
        <div id="search" className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find the Perfect Gift</h2>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Discover unique and thoughtful gifts for every occasion
          </p>
          <div className="flex w-full items-center space-x-2 mx-auto">
            <form action="/search" className="flex w-full items-center space-x-2">
              <Input type="search" name="query" placeholder="Search for gifts..." className="flex-1" />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container px-4 md:px-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
            <Link href="/categories" className="flex items-center text-sm font-medium text-primary">
              View all categories
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Suspense fallback={<CategorySkeletons count={5} />}>
               {categories.length>0?(
                 categories?.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))
               ):(<CategorySkeletons count={5} />)}
             
            </Suspense>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container px-4 md:px-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* <h2 className="text-2xl font-bold tracking-tight">Featured Gifts</h2> */}
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>

            <Link href="/products" className="flex items-center text-sm font-medium text-primary">
              View all products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Suspense fallback={<ProductSkeletons count={8} />}>
            {products?.length>0?(products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))):(<ProductSkeletons count={8} />)}
              
            </Suspense>
          </div>
        </div>
      </section>

      {/* Gift For You Section */}
      <section className="container px-4 md:px-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* <h2 className="text-2xl font-bold tracking-tight">Featured Gifts</h2> */}
            <h2 className="text-2xl font-bold tracking-tight">Gift For You</h2>

            <Link href="/products" className="flex items-center text-sm font-medium text-primary">
              View all products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            <Suspense fallback={<ProductSkeletons count={4} />}>
            {giftforyou?.length>0?(giftforyou?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))):(<ProductSkeletons count={4} />)}
              
            </Suspense>
          </div>
        </div>
      </section>

      {/* Gift Ideas Section */}
      <section className="container px-4 md:px-6 py-6 bg-muted rounded-lg">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Gifts for Every Occasion</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Whether it's a birthday, anniversary, or just because, we have the perfect gift for your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild>
                <Link href="/occasions/birthday">
                  <Gift className="mr-2 h-4 w-4" />
                  Birthday Gifts
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/occasions">View All Occasions</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 z-10 rounded-lg" />
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Gift collection"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container px-4 md:px-6 py-6">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">What Our Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                    />
                  ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "I found the perfect gift for my friend's birthday. The quality was excellent and the delivery was
                prompt. Will definitely shop here again!"
              </p>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <p className="text-sm font-medium">Customer {i}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-6 py-12 bg-primary text-primary-foreground rounded-lg">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Find the Perfect Gift?</h2>
          <p className="mx-auto max-w-[700px] text-primary-foreground/80">
            Join thousands of happy customers who have found the perfect gifts for their loved ones.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 pt-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
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
            <Skeleton className="h-[100px] w-full rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
    </>
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
