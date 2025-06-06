"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/utils/FetchNodeServices"

export function ProductFilters({ setFilters, setPage }: any) {
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [isGift, setIsGift] = useState<boolean>(false)
  const [categories, setCategories] = useState([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const applyFilters = () => {
    const body: any = {}
    if (selectedCategories.length) body.subCategory = selectedCategories
    if (selectedColors.length) body.colors = selectedColors
    if (priceRange.min) body.minPrice = Number(priceRange.min)
    if (priceRange.max) body.maxPrice = Number(priceRange.max)
    if (isGift) body.isGift = true

    setPage(1)
    setFilters(body)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedColors([])
    setPriceRange({ min: "", max: "" })
    setIsGift(false)
    setPage(1)
    setFilters({})
  }

  const fetchCategory = async () => {
    try {
      const response = await apiClient("GET", `/api/subCategory/all`)
      if (response.ok) setCategories(response.data)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Filters</h3>
        <Accordion type="multiple" defaultValue={["categories", "price", "colors"]}>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories?.map((item:any) => (
                  <div key={item._id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategories.includes(item._id)}
                      onCheckedChange={() => handleCategoryChange(item._id)}
                    />
                    <Label>{item.name}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min-price">Min</Label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-price">Max</Label>
                  <input
                    type="number"
                    value={priceRange.max}
                    placeholder="e.g. 5000"
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {["red", "blue", "green", "black", "white"].map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => handleColorChange(color)}
                    />
                    <Label className="capitalize">{color}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2 pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={isGift}
          onCheckedChange={() => setIsGift(!isGift)}
        />
        <Label>Gift Items</Label>
      </div>
    </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">Reset</Button>
      </div>
    </div>
  )
}
