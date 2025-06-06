"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Package, User, MapPin, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Separator } from "@/components/ui/separator"
import { json } from "stream/consumers"
import { apiClient } from "@/utils/FetchNodeServices"

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
})

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [user, setUserData] = useState(null);
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  // const { user, signOut } = useAuth()

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);
  

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const userNamesplit = user?.name?.split(" ")

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName:userNamesplit?.[0] || "",
      lastName: userNamesplit?.[0] || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  })


  useEffect(() => {
    if (user) {
      const userNamesplit = user.name?.split(" ") || [];
      form.reset({
        firstName: userNamesplit[0] || "",
        lastName: userNamesplit[1] || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
  
    try {
      const body = {
        name: values.firstName + " " + values.lastName,
        email: values.email,
        phone: values.phone,
      };  
      const response = await apiClient("PUT", "/api/user", body);
  
      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        // Optionally update localStorage
        localStorage.setItem("userData", JSON.stringify(response.data));
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while updating the profile.",
        variant: "destructive",
      });
    }
  
    setIsLoading(false);
  }
  

  if (!isMounted) {
    return null
  }

  const signOut = async() =>{
      try{
        const res = await apiClient("POST", `/api/auth/logout`);
        if(res.ok)
        {
          localStorage.removeItem("userData")
          toast({
            title: "logout Successfully",
          })
          router.push("/login")

          setTimeout(() => {
            window.location.reload()
          }, 2000)        }
      }catch(e)
      {
        toast({
          title: "Something went wrong!",
        })
      }
    }

  // Redirect if not logged in
  // if (!user) {
  //   router.push("/login")
  //   return null
  // }

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
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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
            <Separator />
            <Button variant="outline" className="w-full" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">Update your account profile information.</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="addresses" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Addresses</h3>
                <p className="text-sm text-muted-foreground">Manage your shipping and billing addresses.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Default Address</h4>
                      <p className="text-sm text-muted-foreground">Shipping & Billing</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/account/addresses">Edit</Link>
                    </Button>
                  </div>
                  <div className="text-sm">
                    <p>
                      {user?.name}
                    </p>
                    <p>123 Main St</p>
                    <p>Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                    <p>{user?.phone}</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex items-center justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/account/addresses">Manage Addresses</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
              </div>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Change Password</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
