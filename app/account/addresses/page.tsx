"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, User, Package, Heart, Plus, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { AddressForm, type AddressFormValues } from "@/components/address-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/utils/FetchNodeServices"
import { Elsie_Swash_Caps } from "next/font/google"

interface Address {
  _id: string
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function AddressesPage() {
  // const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, [])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await apiClient("GET", "/api/address");

        if (res.ok) {
          
          setAddresses(res.addresses)
          setIsLoading(false)

        } else {
          console.error("Failed to fetch addresses");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchAddresses();
  }, []);
  
  

  const handleAddAddress = (values: AddressFormValues) => {
    const newAddress: Address = {
      _id: `addr${Date.now()}`,
      ...values,
    }

    // If the new address is set as default, update other addresses
    if (newAddress.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: false,
        })),
      )
    }

    setAddresses((prev) => [...prev, newAddress])
    setIsAddDialogOpen(false)
  }

  const handleEditAddress = (values: AddressFormValues) => {
    if (!currentAddress) return

    // If the edited address is set as default, update other addresses
    if (values.isDefault && !currentAddress.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === currentAddress._id ? values.isDefault : false,
        })),
      )
    } else {
      setAddresses((prev) => prev.map((addr) => (addr._id === currentAddress._id ? { ...addr, ...values } : addr)))
    }
    setIsEditDialogOpen(false)
    setCurrentAddress(null)
  }


  const handleDeleteAddress = async() => {
    if (!currentAddress) return

    // Don't allow deleting the default address if it's the only one
    if (currentAddress.isDefault && addresses.length === 1) {
      
      toast({
        title: "Cannot delete default address",
        description: "You must have at least one address.",
        variant: "destructive",
      })
      setIsDeleteDialogOpen(false)
      setCurrentAddress(null)
      return
    }

    try {
      const res = await apiClient("DELETE", `/api/address/${currentAddress._id}`);
       if(res.ok)
       {
        toast({
          title: "Address has been deleted successfully!",
          // description: "You must have at least one address.",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setCurrentAddress(null)
       }
    } catch (error) {
      toast({
        title: error,
        // description: "You must have at least one address.",
        variant: "destructive",
      })
    }

    setAddresses((prev) => prev.filter((addr) => addr._id !== currentAddress._id))

    // If we deleted the default address and there are other addresses, make the first one default
    if (currentAddress.isDefault && addresses.length > 1) {
      setAddresses((prev) => {
        const newAddresses = [...prev]
        if (newAddresses.length > 0) {
          newAddresses[0].isDefault = true
        }
        return newAddresses
      })
    }

    toast({
      title: "Address deleted",
      description: "Your address has been deleted successfully.",
    })

    setIsDeleteDialogOpen(false)
    setCurrentAddress(null)
  }

  if (!user) {
    return null
  }

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
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">My Addresses</h1>
                <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-6 h-48 animate-pulse bg-muted/20"></div>
                ))}
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-6 space-y-4 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{address.fullName}</h4>
                        {address?.isDefault && (
                          <Badge variant="outline" className="mt-1">
                            Default Address
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentAddress(address)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentAddress(address)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                      <p className="pt-1">{address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No Addresses Yet</h3>
                <p className="text-muted-foreground mt-1">You haven&apos;t added any addresses yet.</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                  Add New Address
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>Add a new shipping or billing address to your account.</DialogDescription>
          </DialogHeader>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setIsAddDialogOpen(false)}
            defaultValues={{
              fullName: `${user.name}`,
              phone: user.phone || "",
              country: "India",
              isDefault: addresses.length === 0,
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update your shipping or billing address.</DialogDescription>
          </DialogHeader>
          {currentAddress && (
            <AddressForm
              isEditing
              defaultValues={{
                fullName: currentAddress.fullName,
                addressLine1: currentAddress.addressLine1,
                addressLine2: currentAddress.addressLine2,
                city: currentAddress.city,
                state: currentAddress.state,
                zipCode: currentAddress.zipCode,
                country: currentAddress.country,
                phone: currentAddress.phone,
                isDefault: currentAddress.isDefault,
              }}
              onSubmit={handleEditAddress}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setCurrentAddress(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Address Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this address from your account.
              {currentAddress?.isDefault && " This is your default address."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentAddress(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAddress}>Delete Address</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
