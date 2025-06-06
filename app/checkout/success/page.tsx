"use client"

import Link from "next/link"
import { useEffect } from "react"
import { CheckCircle, Package, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart()
  }, [clearCart])

  return (
    <div className="container px-4 md:px-6 py-10 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          Your order has been placed successfully. We&apos;ve sent a confirmation email to your inbox.
        </p>
        <div className="rounded-lg border p-6 text-left">
          <h2 className="text-lg font-medium">Order #ORD-12345</h2>
          <p className="text-sm text-muted-foreground">June 23, 2023</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Estimated Delivery: June 30, 2023</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/orders">Track Order</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
