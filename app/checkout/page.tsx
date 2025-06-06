"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRazorpay } from "react-razorpay"
import { apiClient } from "@/utils/FetchNodeServices"
import clsx from "clsx"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  
  const { toast } = useToast()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { Razorpay } = useRazorpay()

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
      }
    }
    fetchCartItems()
  }, [])

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const calcSubtotal = () => {
      const sum = cartItems.reduce((acc, item) => {
        const price = item.product.variants[0]?.price || 0
        return acc + price * item.quantity
      }, 0)
      setSubtotal(sum)
    }
    calcSubtotal()
  }, [cartItems])

  // Get promo code from localStorage and apply discount
  useEffect(() => {
    const promoString = localStorage.getItem("PROMOCODE");
  
    if (promoString) {
      try {
        const promocode = JSON.parse(promoString);
        setAppliedPromoCode(promocode);
        
        const getCouponDiscount = async() => {
          try {
            const body = { "couponCode": promocode, "cart": cartItems }
            const response = await apiClient('POST', `/api/coupons/apply-coupon`, body);
            if (response?.success) {
              setDiscount(response?.discount)
            }    
          } catch (error) {
            console.error("Failed to apply saved promo code:", error);
            localStorage.removeItem("PROMOCODE");
            setAppliedPromoCode(null);
          }
        };
  
        if (promocode && cartItems.length > 0) {
          getCouponDiscount();
        }
      } catch (error) {
        console.error("Error parsing promo code from localStorage:", error);
        localStorage.removeItem("PROMOCODE");
      }
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await apiClient("GET", "/api/address")
        setAddresses(res.addresses || [])
        if (res.addresses?.length > 0) {
          const defaultAddress = res.addresses.find((a: any) => a.isDefault)
          setSelectedAddressId(defaultAddress?._id || res.addresses[0]._id)
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err)
        toast({ title: "Error", description: "Unable to load addresses", variant: "destructive" })
      }
    }

    fetchAddresses()
  }, [])

  async function handlePlaceOrder() {
    if (cartItems.length === 0 || !selectedAddressId) {
      toast({
        title: "Missing Info",
        description: "Cart or address information is missing.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Include promoCode in order creation if available
      const orderData = { 
        addressId: selectedAddressId,
        promoCode: appliedPromoCode || undefined
      };
      
      const { order } = await apiClient("POST", "/api/order", orderData)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.priceToPay,
        currency: "INR",
        name: "Gift Ginnie",
        order_id: order.razorpayOrderId,
        handler: async (res: any) => {
          const resaa = await apiClient("POST", "/api/transaction/verify", res)
          if (resaa.ok) {
            // Clear cart and promo code after successful order
            localStorage.removeItem("PROMOCODE");
            const r = await apiClient("DELETE", "/api/cart/clear")
            if (r.ok) {
              router.push("/account/orders")
            }
          }
        },
        prefill: {
          name: user?.firstName,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#F37254" },
      }

      const rzp = new Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Order creation error:", err)
      toast({ title: "Error", description: "Checkout failed.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate final totals
  const totalWithDiscount = subtotal - discount
  const shipping = subtotal > 0 ? 5.99 : 0 // Assuming fixed shipping
  const total = totalWithDiscount

  if (cartItems.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Add items before checking out.</p>
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
    <div className="container py-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select a Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.length > 0 ? (
                addresses.map((addr: any) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={clsx(
                      "cursor-pointer border rounded-lg p-4 transition",
                      selectedAddressId === addr._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    )}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="text-sm text-gray-700">
                      {addr.addressLine1}, {addr.addressLine2}
                    </p>
                    <p className="text-sm text-gray-700">
                      {addr.city}, {addr.state}, {addr.zipCode}
                    </p>
                    <p className="text-sm text-gray-700">{addr.country}</p>
                    <p className="text-sm text-gray-700">Phone: {addr.phone}</p>
                  </div>
                ))
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/account/addresses">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Add Address
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Link>
            </Button>
            <div>
              <Button
                onClick={() => router.push("/account/addresses")}
                variant="outline"
                className="mr-5"
              >
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Address
                </>
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={isLoading || !selectedAddressId}
              >
                {isLoading ? "Processing..." : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary - Made to match the cart page */}
        <div>
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.product._id}-${item.product.variants[0]._id}`} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-muted rounded-md overflow-hidden">
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
                    <span className="text-sm">{item.product.title} x {item.quantity}</span>
                  </div>
                  <span className="font-medium">
                    ₹{(item.product.variants[0]?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (Applied)</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}