"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Package, ShoppingCart, Trash, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export default function AccountWishlistPage() {
  // const { user } = useAuth()
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
    const [user, setUserData] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
    if (!storedData) {
      router.push("/login")
    }
  }, [])

  if (!user) {
    return null
  }

  const handleRemoveItem = (productId: string) => {
    alert("SSS")
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


  
  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {user.name}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <nav className="space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <Heart className="h-4 w-4" />
                My Wishlist
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">Manage your saved items</p>
            </div>

            {wishlistItems.length > 0 ? (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4">
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
                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearWishlist}>
                    Clear Wishlist
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Your Wishlist is Empty</h3>
                <p className="text-muted-foreground mt-1">You haven&apos;t added any items to your wishlist yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
