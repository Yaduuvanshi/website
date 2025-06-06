"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProductQuantitySelector() {
  const [quantity, setQuantity] = useState(1)

  const increment = () => {
    setQuantity((prev) => Math.min(prev + 1, 99))
  }

  const decrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= 99) {
      setQuantity(value)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity</Label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-r-none"
          onClick={decrement}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <Input
          id="quantity"
          type="number"
          min="1"
          max="99"
          className="h-9 w-14 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={quantity}
          onChange={handleChange}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-l-none"
          onClick={increment}
          disabled={quantity >= 99}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
    </div>
  )
}
