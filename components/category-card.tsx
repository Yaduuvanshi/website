import Link from "next/link"
import type { Category } from "@/types"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`} className="group flex flex-col items-center">
      <div className="overflow-hidden rounded-lg bg-muted w-full">
        <img
          src={category.image || "/placeholder.svg?height=200&width=200"}
          alt={category.name}
          className="h-[200px] w-full object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <h3 className="mt-2 text-sm font-medium">{category.name}</h3>
    </Link>
  )
}
