"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/utils/FetchNodeServices"
import { Skeleton } from "@/components/ui/skeleton"

// Define a type for the coupon data based on the provided format
interface CouponData {
  code: string;
  createdAt: string;
  currentUsage: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive: boolean;
  maxDiscountAmount?: number; // Optional, as it might not always be present for fixed discounts
  minimumPurchase: number;
  // ok: boolean; // These fields are unusual in data objects, usually part of response wrappers.
  // status: number; // Will rely on isActive, dates, etc. for validation.
  updatedAt: string;
  usageLimit: number;
  validFrom: string;
  validTo: string;
}


export default function CartPage() {
  const { removeFromCart, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()

  const [cartItems, setCartItems] = useState<any[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null) // To store the successfully applied promo code

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await apiClient("GET", "/api/cart")
        if (res.ok) {
          const formattedItems = res.data.map((item: any) => ({
            product: {
              _id: item.productId,
              title: item.title,
              description: item.description,
              images: item.productImages,
              variants: [
                {
                  _id: item.variantId,
                  color: item.variantColor,
                  description: item.variantDescription,
                  price: item.variantPrice,
                  stock: item.variantStock,
                  images: item.variantImages,
                }
              ]
            },
            quantity: item.quantity,
            isGift: item.isGift
          }))
          setCartItems(formattedItems)
        }
      } catch (error) {
        console.error("Failed to fetch cart items", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCartItems()
  }, [])

  useEffect(() => {
    const calcSubtotal = () => {
      const sum = cartItems.reduce((acc, item) => {
        const price = item.product.variants[0]?.price || 0
        return acc + price * item.quantity
      }, 0)
      setSubtotal(sum)
      // Note: If a discount is applied, and cart changes, the discount might become invalid.
      // A more advanced implementation would re-validate the applied coupon here.
      // For this scope, discount is only reset by applying another code or clearing cart.
    }
    calcSubtotal()
  }, [cartItems])

  const handleQuantityChange = (productId: string, variantId: string, quantity: number) => {
    updateQuantity(productId, variantId, quantity)
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId && item.product.variants[0]._id === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string, variantId: string) => {
    removeFromCart(productId, variantId)
    setCartItems((prev) =>
      prev.filter((item) => !(item.product._id === productId && item.product.variants[0]._id === variantId))
    )
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Enter a promo code",
        description: "Please enter a promo code to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingPromo(true);
    setDiscount(0); // Reset previous discount
    setAppliedPromoCode(null);

    try {
      const body = { "couponCode": promoCode.trim(), "cart": cartItems }
      const response = await apiClient('POST', `/api/coupons/apply-coupon`, body);
      console.log("DDDDDDDDDDDDDDDDDD:", response)
      if (response?.ok) {
        localStorage.setItem("PROMOCODE",JSON.stringify(promoCode))
        setDiscount(response?.discount)
        toast({
          title: "Promo Code Applied!",
          description: `You've saved ₹${response?.discount}.`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: response.message || "The promo code is invalid or expired.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.log("DDDDDDDDDDDDDDDD:",error)
      localStorage.removeItem("PROMOCODE")
      toast({
        title: "Error",
        description: "An unexpected error occurred while applying the promo code.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const totalWithDiscount = subtotal - discount
  const shipping = subtotal > 0 ? 5.99 : 0 // Assuming fixed shipping or free above a certain subtotal (not implemented here)
  const total = totalWithDiscount

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4">
                <Skeleton className="w-full sm:w-24 h-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-10 text-center">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
        <Button asChild className="mt-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  console.log("print all items which has been added to cart:", cartItems)

  return (
    <div className="container px-4 md:px-6 py-6">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.product._id}-${item.product.variants[0]._id}-${index}`} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4">
                <div className="w-full sm:w-24 h-24 bg-muted rounded-md overflow-hidden">
                  <img
                    src={
                      item.product.variants[0]?.images?.[0] ||
                      item.product.images?.[0] ||
                      "/placeholder.svg?height=100&width=100"
                    }
                    alt={item.product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{item.product.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.variants[0]?.color}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product._id, item.product.variants[0]._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product._id, item.product.variants[0]._id, item.quantity + 1)}
                      // Add disabled={item.quantity >= item.product.variants[0]?.stock} for stock check
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        ₹{(item.product.variants[0]?.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => handleRemoveItem(item.product._id, item.product.variants[0]._id)}
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
            <Button variant="outline" onClick={() => {
              clearCart()
              setCartItems([])
              setSubtotal(0)
              setDiscount(0)
              setAppliedPromoCode(null) // Reset applied promo code on clear cart
            }}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedPromoCode || "Applied"})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div> */}
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo || !promoCode.trim()}
                >
                  {isApplyingPromo ? "Applying..." : "Apply"}
                </Button>
              </div>
              {appliedPromoCode && discount > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Promo code <span className="font-semibold">"{appliedPromoCode}"</span> applied!
                </p>
              )}
            </div>
            <Button className="w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}