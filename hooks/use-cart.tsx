"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import type { Product, CartItem } from "@/types"
import { apiClient } from "@/utils/FetchNodeServices"
import { useRouter } from "next/navigation"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product,selectedVarientId:string,quantity?: number) => void
  removeFromCart: (productId: string, variantId: string) => void
  updateQuantity: (productId: string,variantId:string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: any
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter() // ⬅️ useRouter hook

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }

  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = async (product: Product,selectedVarientId:string, quantity = 1) => {
    const userData = localStorage.getItem("userData")
    const parsedUser = JSON.parse(userData || "{}")

    if (!parsedUser?.isVerified) {
      router.push("/login")
      return
    }

    try {
      if (parsedUser?.isVerified) {
        const body = {
          productId: product._id,
          variantId: selectedVarientId,
          quantity,
        }
        const res = await apiClient("POST", "/api/cart", body)
        if(res.ok) router.push('/cart')
      }
    } catch (error) {
      console.error("Failed to sync cart with backend:", error)
    }
  }

  const updateQuantity = async (productId: string,variantId:string, quantity: number) => {

    try {
      const userData = localStorage.getItem("userData")
      const parsedUser = JSON.parse(userData || "{}")

      if (parsedUser?.isVerified) {
        if (productId && variantId && quantity) {
          const body = {
            productId,
            variantId,
            quantity,
          }
          const re=await apiClient("PUT", "/api/cart", body)
          if(re.ok)
          {
            // window.location.reload()
          }
        }
      }
    } catch (error) {
      console.error("Failed to update quantity on backend:", error)
    }
  }


  
  const removeFromCart = async (productId: string, variantId: string) => {
    // setCartItems((prevItems) =>
    //   prevItems.filter((item) => item.product._id !== productId)
    // )

    try {
      const userData = localStorage.getItem("userData")
      const parsedUser = JSON.parse(userData || "{}")

      if (parsedUser?.isVerified) {
        const res =await apiClient("DELETE", "/api/cart", { productId, variantId })
        if(res.ok)
        {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Failed to remove item from backend:", error)
    }
  }

  const clearCart = async () => {
    setCartItems([])

    try {
      const userData = localStorage.getItem("userData")
      const parsedUser = JSON.parse(userData || "{}")

      if (parsedUser?.isVerified) {
        await apiClient("DELETE", "/api/cart/clear")
      }
    } catch (error) {
      console.error("Failed to clear backend cart:", error)
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

 

  const subtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.variants[0]?.price || 0
      return total + price * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
