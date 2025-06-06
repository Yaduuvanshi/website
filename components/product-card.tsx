"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id))
  const router = useRouter();


  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      setInWishlist(false)
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      setInWishlist(true)
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-background">
      <Link href={`/products/${product._id}`} className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0] || "/placeholder.svg?height=400&width=400"}
          alt={product.title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        {product.variants.some((variant) => variant.isGift) && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Gift</div>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={toggleWishlist}
      >
        <Heart className={`h-4 w-4 ${inWishlist ? "fill-primary text-primary" : ""}`} />
        <span className="sr-only">Add to wishlist</span>
      </Button>
      <div className="flex flex-col space-y-1.5 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
              />
            ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">₹{product.variants[0]?.price.toFixed(2)}</p>
        </div>
        <Button size="sm" className="mt-2" onClick={()=>router.push(`/products/${product._id}`)}>
              Browse Product
        </Button>
      </div>
    </div>
  )
}
