"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, User, Package, Heart, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/utils/FetchNodeServices"
import { useParams } from "next/navigation"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

export default function OrderDetailsPage({ }) {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [user, setUser] = useState<any>()
  const [showFull, setShowFull] = useState(false);
  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      setUser(JSON.parse(storedData))
    }

    const fetchOrderByOrderId = async () => {
      try {
        const res = await apiClient("GET", `/api/order/${id}`)
        if (res.ok) {
          setOrder(res.order)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Something went wrong",
          description: "We couldn't fetch the order details.",
          variant: "destructive",
        });
      }
    }

    fetchOrderByOrderId()
  }, [id])

  const handleDownloadInvoice = () => {
    setIsGeneratingInvoice(true);

    const doc = new jsPDF();

    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Gift Ginnie", 14, 15);

    doc.setFontSize(16);
    doc.text("Invoice", 14, 25);

    doc.setFontSize(12);
    doc.text(`Customer: ${user?.name}`, 14, 35);
    doc.text(`Email: ${user?.email}`, 14, 41);
    doc.text(`Phone: ${user?.phone}`, 14, 47);

    const addr = order.address;
    doc.text("Shipping Address:", 14, 55);
    doc.text(
      `${addr.fullName}, ${addr.addressLine1}, ${addr.addressLine2}, ${addr.city}, ${addr.state}, ${addr.zipCode}, ${addr.country}`,
      14,
      61
    );

    doc.text(`Order ID: ${order._id}`, 14, 71);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 77);
    doc.text(`Payment Status: ${order.paymentStatus}`, 14, 83);
    doc.text(`Order Status: ${order.status}`, 14, 89);

    const productRows = order.products.map((item: any, index: number) => [
      index + 1,
      item.title,
      item.description || "-",
      item.quantity,
      item.price || item.product?.price || 0,
      (item.quantity * (item.price || item.product?.price || 0)).toFixed(2),
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["#", "Title", "Description", "Qty", "Price", "Total"]],
      body: productRows,
    });

    const finalY = doc.lastAutoTable?.finalY || 100;

    doc.setFontSize(12);
    doc.setFont("helvetica");
    doc.text(`Subtotal: Rs. ${order.totalAmount}`, 14, finalY + 10);
    doc.text(`Discount: Rs. ${order.discount || 0}`, 14, finalY + 16);
    doc.text(`Price to Pay: Rs. ${order.priceToPay}`, 14, finalY + 22);

    doc.save(`Invoice_${order._id}.pdf`);
    setIsGeneratingInvoice(false);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default"
      case "Processing":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const isEligibleForReturn = order?.status === "Delivered"

  const AccountSidebar = () => (
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
  )

  const Timeline = () => {
    const events = [
      { date: order?.createdAt, status: "Order Placed", color: "blue" },
      { date: order?.shippedAt, status: "Shipped", color: "yellow" },
      { date: order?.outForDeliveryAt, status: "Out for Delivery", color: "orange" },
      { date: order?.deliveredAt, status: "Delivered", color: "green" },
    ]

    console.log("ORDERSSSSSSSSSSSSSS:", order)
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="space-y-2">
          {events.map((event, index) => (
            event?.date && (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2.5 h-2.5 rounded-full ${event.color}-500`} />
                <div>
                  <p className="text-sm font-medium">{event.status}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date)?.toLocaleDateString()}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    )
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link
                href="/account/orders"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Orders
              </Link>
            </div>
            <div className="flex gap-2">
              {isEligibleForReturn && (
                /*<Button variant="outline" asChild>
                  <Link href={`/account/orders/${id}/return`}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Return Items
                  </Link>
                </Button>*/
                <></>
              )}
              <Button onClick={handleDownloadInvoice} disabled={isGeneratingInvoice || order?.status === "Cancelled"}>
                <Download className="mr-2 h-4 w-4" />
                {isGeneratingInvoice ? "Generating..." : "Download Invoice"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div className="border rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Order {order?._id}</h1>
                    <p className="text-muted-foreground">Placed on {new Date(order?.createdAt)?.toLocaleDateString()}</p>
                  </div>
                  <Badge variant={getStatusColor(order?.status)}>{order?.status}</Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <p>{order?.address?.fullName}</p>
                    <p>{order?.address?.addressLine1}</p>
                    <p>{order?.address?.addressLine2}</p>
                    <p>{order?.address?.city}, {order?.address?.state} {order?.address?.zipCode}</p>
                    <p>{order?.address?.country}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                    <p>Method: {order?.paymentStatus}</p>
                    <p>Paid Amount: ₹{order?.priceToPay}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Timeline />
              <h3 className="text-lg font-semibold">Items</h3>
              <div className="space-y-4">
                {order?.products?.map((item: any) => (
                  <div key={item?._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item?.variant?.images?.[0]} alt={item?.variant?._id} className="w-16 h-16 object-cover" />
                      <div>
                        <p className="text-sm font-medium">{item?.variant?.color}</p>
                        <p className="text-sm text-muted-foreground">Variant: {item?.variant?._id?.slice(0, 10)
                        }</p>
                        <p className="text-sm text-muted-foreground">
                          Description:{" "}
                          {showFull ? item?.variant?.description : item?.variant?.description?.slice(0, 20)}
                          {item?.variant?.description?.length > 20 && (
                            <button
                              onClick={() => setShowFull(!showFull)}
                              className="text-blue-500 underline ml-1"
                            >
                              {showFull ? "less" : "...more"}
                            </button>
                          )}
                        </p>

                        <p className="text-sm text-muted-foreground mt-1">Color :&nbsp;{item?.variant?.color}</p>
                      </div>
                    </div>

                    <p className="text-sm">₹{item?.variant?.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
