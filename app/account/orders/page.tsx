"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, User, Heart, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { apiClient } from "@/utils/FetchNodeServices"

type OrderType = {
  _id: string
  razorpayOrderId: string
  createdAt: string
  status: "Processing" | "Delivered" | "Cancelled"
  totalAmount: number
  products: OrderProduct[]
}

type OrderProduct = {
  productId: string
  quantity: number
  price: number
  // Aur bhi fields ho sakti hain, aapke backend par depend karega
}

type UserType = {
  name: string
  email: string
}

export default function OrdersPage() {
  // const { user } = useAuth()
  const router = useRouter()
  const [user, setUserData] = useState<UserType | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    // if (!user) {
    //   router.push("/login")
    //   return
    // }
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, [])

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await apiClient("POST", "/api/order/user", {})
        if (res.ok) {
          setOrders(res.orders)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchAllOrders()
  }, [])

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {user?.name}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
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
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                My Addresses
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
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
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">View and track your orders</p>
            </div>

            {orders?.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.razorpayOrderId}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : order.status === "Processing"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{order?.products?.length} items</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/account/orders/${order?._id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium">No Orders Yet</h3>
                <p className="text-muted-foreground mt-1">You haven&apos;t placed any orders yet.</p>
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
