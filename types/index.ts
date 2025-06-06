export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
}

export interface Product {
  _id: string
  title: string
  description: string
  images: string[]
  variants: Variant[]
  reviews: Review[]
}

export interface Variant {
  id: string
  description: string
  price: number
  color: string
  images: string[]
  stock: number
  isGift: boolean
}

export interface Review {
  id: string
  userId: string
  text: string
  rating: number
}

export interface Category {
  id: string
  name: string
  description: string
  images: string
  subCategories: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  description: string
  images: string
  products: Product[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  products: CartItem[]
  deliveryAddress: Address
  totalAmount: number
  status: string
  paymentStatus: string
  razorpayOrderId?: string
}

export interface Address {
  id: string
  street: string
  pincode: number
  city: string
  state: string
  country: string
}
