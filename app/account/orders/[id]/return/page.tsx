"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Package, User, Heart, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const returnFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value?.length > 0, {
    message: "You must select at least one item to return",
  }),
  reason: z.string().min(1, { message: "Please select a return reason" }),
  comments: z.string().optional(),
  refundMethod: z.enum(["original", "store_credit"]),
})

export default function ReturnOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock order data - in a real app, this would be fetched from an API
  const order = {
    id: params.id,
    date: "2023-06-15",
    status: params.id === "ORD-1234" ? "Delivered" : params.id === "ORD-5678" ? "Processing" : "Cancelled",
    items: [
      {
        id: "1",
        name: "Personalized Photo Frame",
        variant: "Wooden Frame",
        price: 39.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        name: "Aromatherapy Gift Set",
        variant: "Lavender Set",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "3",
        name: "Gourmet Chocolate Box",
        variant: "Dark Chocolate",
        price: 29.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ].slice(0, params.id === "ORD-1234" ? 3 : params.id === "ORD-5678" ? 2 : 1),
  }

  const form = useForm<z.infer<typeof returnFormSchema>>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      items: [],
      reason: "",
      comments: "",
      refundMethod: "original",
    },
  })

  const onSubmit = async (values: z.infer<typeof returnFormSchema>) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Return request submitted",
        description: "Your return request has been submitted successfully. We'll process it shortly.",
      })

      // Redirect back to order details
      router.push(`/account/orders/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fix the AccountSidebar component to use proper user data
  const AccountSidebar = () => (
    <div className="md:w-1/4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
            U
          </div>
          <div>
            <h2 className="text-xl font-bold">Account</h2>
            <p className="text-sm text-muted-foreground">Manage your account</p>
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

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <Link
              href={`/account/orders/${params.id}`}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Order
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Return Items from Order #{params.id}</h1>
                <p className="text-muted-foreground">
                  Please select the items you wish to return and provide a reason.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Select Items to Return</h2>
                    <FormField
                      control={form.control}
                      name="items"
                      render={() => (
                        <FormItem>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 border rounded-lg p-4">
                                <FormField
                                  control={form.control}
                                  name="items"
                                  render={({ field }) => {
                                    return (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )
                                  }}
                                />
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">{item.variant}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${item.price.toFixed(2)}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Return Reason</h2>
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="damaged" />
                                </FormControl>
                                <FormLabel className="font-normal">Item arrived damaged</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="defective" />
                                </FormControl>
                                <FormLabel className="font-normal">Item is defective</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="wrong_item" />
                                </FormControl>
                                <FormLabel className="font-normal">Received wrong item</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="not_as_described" />
                                </FormControl>
                                <FormLabel className="font-normal">Item not as described</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="changed_mind" />
                                </FormControl>
                                <FormLabel className="font-normal">Changed my mind</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">Other reason</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Additional Comments</h2>
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide any additional details about your return request"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Refund Method</h2>
                    <FormField
                      control={form.control}
                      name="refundMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="original" />
                                </FormControl>
                                <FormLabel className="font-normal">Refund to original payment method</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="store_credit" />
                                </FormControl>
                                <FormLabel className="font-normal">Store credit</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => router.push(`/account/orders/${params.id}`)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Return Request"}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Return Policy</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Items must be returned within 30 days of delivery. All items must be in their original condition with
                  tags attached. Once your return is received and inspected, we will process your refund within 5-7
                  business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
