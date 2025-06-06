"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // If no images are provided, use a placeholder
  const displayImages = images?.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-4">
      <div 
        className="overflow-hidden rounded-lg bg-muted relative"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={displayImages[selectedImage] || "/placeholder.svg"}
          alt="Product image"
          width={600}
          height={600}
          className={`h-full w-full object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={{
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          }}
        />
      </div>
      <div className="flex space-x-2 overflow-auto pb-2">
        {displayImages?.map((image, index) => (
          <button
            key={index}
            className={`relative h-20 w-20 cursor-pointer rounded-lg bg-muted ${
              selectedImage === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="h-full w-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
