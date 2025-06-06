"use client"

import Link from "next/link"
import { ArrowLeft, ShoppingCart, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (productId: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
    })
  }

  const handleAddToCart = (productId: string) => {
    const product = wishlistItems.find((item) => item.id === productId)
    if (product) {
      addToCart(product)
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-10 text-center">
        <h1 className="text-2xl font-bold">Your Wishlist is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven&apos;t added any items to your wishlist yet.</p>
        <Button asChild className="mt-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-6">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <div className="mt-8 grid gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4">
            <div className="w-full sm:w-24 h-24 bg-muted rounded-md overflow-hidden">
              <img
                src={item.images[0] || "/placeholder.svg?height=100&width=100"}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.variants[0]?.color}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-medium">${item.variants[0]?.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => handleAddToCart(item.id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <Button variant="outline" onClick={clearWishlist}>
          Clear Wishlist
        </Button>
      </div>
    </div>
  )
}
