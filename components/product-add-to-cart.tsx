"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductAddToCartProps {
  product: Product,
  selectedVariant:any
}

export function ProductAddToCart({ product , selectedVariant }: ProductAddToCartProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      // alert("YES")
      addToCart(product,selectedVariant._id)
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
      setIsLoading(false)
    }, 500)
  }

  return (
    <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? (
        "Adding..."
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
