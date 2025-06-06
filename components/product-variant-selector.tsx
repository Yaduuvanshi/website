"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Variant } from "@/types"

interface ProductVariantSelectorProps {
  variants: Variant[]
  selectedVariantId: string
  onVariantSelect: (variantId: string) => void
}

export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onVariantSelect,
}: ProductVariantSelectorProps) {
  const colorOptions = [...new Set(variants.map((v) => v.color))]

  return (
    <div className="space-y-4">
      {colorOptions.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <RadioGroup
            id="color"
            value={selectedVariantId}
            onValueChange={onVariantSelect}
            className="flex flex-wrap gap-2"
          >
            {variants.map((variant) => (
              <div key={variant._id} className="flex items-center space-x-2">
                <RadioGroupItem value={variant._id} id={`color-${variant._id}`} className="peer sr-only" />
                <Label
                  htmlFor={`color-${variant._id}`}
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mr-2 h-4 w-4 rounded-full border" style={{ backgroundColor: variant.color }} />
                  {variant.color}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  )
}
