"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductAddToWishlistProps {
  product: Product
}

export function ProductAddToWishlist({ product }: ProductAddToWishlistProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    setInWishlist(isInWishlist(product.id))
  }, [product.id, isInWishlist])

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
    <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={toggleWishlist}>
      <Heart className={`mr-2 h-4 w-4 ${inWishlist ? "fill-primary text-primary" : ""}`} />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
