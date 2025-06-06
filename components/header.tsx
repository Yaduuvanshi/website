"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, Search, ShoppingCart, User, X, LogIn, Package, Home, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/utils/FetchNodeServices"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"


export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  // const { user, signOut } = useAuth()
  const [user ,setUser] = useState(null)
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const { toast } = useToast()
  const [lengthofcart,setLengthOfCart]= useState(0)

  useEffect(()=>{
    
    const storedUser = localStorage.getItem("userData")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    }  },[])

    useEffect(()=>{
     const fetchCartItems=async()=>{
      try {
        const res = await apiClient("GET", "/api/cart")
        if(res.ok)
        {
          setLengthOfCart(res?.data?.length)
        }
      } catch (error) {
        console.error(error)
      }
     }

     fetchCartItems()
    },[])
  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "All Products",
      active: pathname === "/products",
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
    },
    // {
    //   href: "/occasions",
    //   label: "Occasions",
    //   active: pathname === "/occasions",
    // },
  ]
  const Logout = async() =>{
    try{
      const res = await apiClient("POST", `/api/auth/logout`);
      if(res.ok)
      {
        localStorage.removeItem("userData")
        toast({
          title: "logout Successfully",
        })
        window.location.reload()
      }

    }catch(e)
    {
      toast({
        title: "Something went wrong!",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => document.body.classList.remove("overflow-hidden")}
              >
                <span className="text-xl font-bold">GiftGinnie</span>
              </Link>
            </div>
            <div className="mt-6 px-1">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/products"
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  All Products
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Categories
                </Link>
                {/* <Link
                  href="/occasions"
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Occasions
                </Link> */}
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Package className="h-5 w-5" />
                      My Orders
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <MapPin className="h-5 w-5" />
                      My Addresses
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="h-5 w-5" />
                      My Wishlist
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-4 md:ml-0 flex items-center">
          <span className="text-xl font-bold">
            <Image
              src="/GiftGinnielogo.svg"
              width={50}
              height={50}
              alt="logo"
            />
          </span>
        </Link>
        <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors ${
                route.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center ml-auto">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="mr-2 relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="mr-4 relative">
              <ShoppingCart className="h-5 w-5" />
              {/* {lengthofcart > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {lengthofcart}
                </span>
              )} */}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/addresses">My Addresses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/wishlist">My Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => Logout()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      {isSearchOpen && (
        <div className="border-t py-3 px-4 md:px-6">
          <form action="/search" className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="query"
              placeholder="Search for products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          </form>
        </div>
      )}
    </header>
  )
}
