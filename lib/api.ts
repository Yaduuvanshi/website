import type { Product, Category } from "@/types"

// Mock data for products
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Personalized Photo Frame",
    description: "A beautiful frame to showcase your favorite memories. Customizable with names and dates.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "1-1",
        description: "Wooden Frame",
        price: 39.99,
        color: "brown",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 15,
        isGift: true,
      },
      {
        id: "1-2",
        description: "Metal Frame",
        price: 49.99,
        color: "silver",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 10,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "2",
    title: "Aromatherapy Gift Set",
    description: "A relaxing set of essential oils and a diffuser for the perfect home spa experience.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "2-1",
        description: "Lavender Set",
        price: 59.99,
        color: "purple",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 8,
        isGift: true,
      },
      {
        id: "2-2",
        description: "Citrus Set",
        price: 59.99,
        color: "orange",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 12,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "3",
    title: "Gourmet Chocolate Box",
    description: "A luxurious assortment of handcrafted chocolates from around the world.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "3-1",
        description: "Dark Chocolate",
        price: 29.99,
        color: "brown",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 20,
        isGift: true,
      },
      {
        id: "3-2",
        description: "Milk Chocolate",
        price: 29.99,
        color: "beige",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 18,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "4",
    title: "Handcrafted Leather Wallet",
    description: "A premium leather wallet with personalized initials. Perfect for a special gift.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "4-1",
        description: "Brown Leather",
        price: 49.99,
        color: "brown",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 7,
        isGift: true,
      },
      {
        id: "4-2",
        description: "Black Leather",
        price: 49.99,
        color: "black",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 9,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "5",
    title: "Customized Star Map",
    description:
      "A beautiful star map showing the night sky from a specific date and location. Perfect for commemorating special moments.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "5-1",
        description: "Black Frame",
        price: 69.99,
        color: "black",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 5,
        isGift: true,
      },
      {
        id: "5-2",
        description: "White Frame",
        price: 69.99,
        color: "white",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 6,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "6",
    title: "Luxury Scented Candle Set",
    description: "A set of premium scented candles made with natural soy wax and essential oils.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "6-1",
        description: "Relaxation Set",
        price: 45.99,
        color: "blue",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 14,
        isGift: true,
      },
      {
        id: "6-2",
        description: "Energizing Set",
        price: 45.99,
        color: "yellow",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 11,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "7",
    title: "Personalized Jewelry Box",
    description: "A beautiful wooden jewelry box with custom engraving. Perfect for storing precious items.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "7-1",
        description: "Small Box",
        price: 35.99,
        color: "brown",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 8,
        isGift: true,
      },
      {
        id: "7-2",
        description: "Large Box",
        price: 55.99,
        color: "brown",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 4,
        isGift: true,
      },
    ],
    reviews: [],
  },
  {
    id: "8",
    title: "Customized Recipe Cutting Board",
    description:
      "A wooden cutting board engraved with a special family recipe. A meaningful gift for cooking enthusiasts.",
    images: ["/placeholder.svg?height=400&width=400"],
    variants: [
      {
        id: "8-1",
        description: "Maple Wood",
        price: 49.99,
        color: "beige",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 6,
        isGift: true,
      },
      {
        id: "8-2",
        description: "Walnut Wood",
        price: 59.99,
        color: "brown",
        images: ["/placeholder.svg?height=400&width=400"],
        stock: 3,
        isGift: true,
      },
    ],
    reviews: [],
  },
]

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: "birthday",
    name: "Birthday Gifts",
    description: "Find the perfect birthday gift for your loved ones",
    images: "/placeholder.svg?height=200&width=200",
    subCategories: [],
  },
  {
    id: "anniversary",
    name: "Anniversary Gifts",
    description: "Celebrate special milestones with our anniversary gift collection",
    images: "/placeholder.svg?height=200&width=200",
    subCategories: [],
  },
  {
    id: "wedding",
    name: "Wedding Gifts",
    description: "Unique and thoughtful wedding gifts for the happy couple",
    images: "/placeholder.svg?height=200&width=200",
    subCategories: [],
  },
  {
    id: "housewarming",
    name: "Housewarming Gifts",
    description: "Welcome friends to their new home with these special gifts",
    images: "/placeholder.svg?height=200&width=200",
    subCategories: [],
  },
  {
    id: "corporate",
    name: "Corporate Gifts",
    description: "Professional gifts for colleagues and clients",
    images: "/placeholder.svg?height=200&width=200",
    subCategories: [],
  },
]

// API functions
export async function getFeaturedProducts(): Promise<Product[]> {
  // In a real app, this would be an API call
  return mockProducts.slice(0, 4)
}

export async function getProducts(params?: any): Promise<Product[]> {
  // In a real app, this would filter based on params
  return mockProducts
}

export async function getProductById(id: string): Promise<Product | null> {
  // In a real app, this would be an API call
  const product = mockProducts.find((p) => p.id === id)
  return product || null
}

export async function getRelatedProducts(id: string): Promise<Product[]> {
  // In a real app, this would find related products
  return mockProducts.filter((p) => p.id !== id).slice(0, 4)
}

export async function getCategories(): Promise<Category[]> {
  // In a real app, this would be an API call
  return mockCategories
}

export async function getCategoryById(id: string): Promise<Category | null> {
  // In a real app, this would be an API call
  const category = mockCategories.find((c) => c.id === id)
  return category || null
}

export async function searchProducts(query: string): Promise<Product[]> {
  // In a real app, this would search products based on query
  return mockProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()),
  )
}
