import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/api"

export default async function OccasionPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch occasion data from an API
  const occasionMap = {
    birthday: {
      name: "Birthday Gifts",
      description: "Find the perfect birthday gift for your loved ones",
    },
    anniversary: {
      name: "Anniversary Gifts",
      description: "Celebrate special milestones with our anniversary gift collection",
    },
    wedding: {
      name: "Wedding Gifts",
      description: "Unique and thoughtful wedding gifts for the happy couple",
    },
    valentines: {
      name: "Valentine's Day",
      description: "Express your love with our Valentine's Day gift selection",
    },
    christmas: {
      name: "Christmas Gifts",
      description: "Spread holiday cheer with our festive Christmas gifts",
    },
    "mothers-day": {
      name: "Mother's Day",
      description: "Show your appreciation with our Mother's Day gift ideas",
    },
    "fathers-day": {
      name: "Father's Day",
      description: "Find the perfect gift to celebrate dad",
    },
    graduation: {
      name: "Graduation Gifts",
      description: "Celebrate academic achievements with our graduation gifts",
    },
  }

  const occasion = occasionMap[params.id as keyof typeof occasionMap]
  const products = await getProducts({ occasion: params.id })

  if (!occasion) {
    return (
      <div className="container px-4 md:px-6 py-10 text-center">
        <h1 className="text-2xl font-bold">Occasion not found</h1>
        <p className="mt-2 text-muted-foreground">
          The occasion you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/occasions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Occasions
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-6">
      <Link
        href="/occasions"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Occasions
      </Link>
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{occasion.name}</h1>
          <p className="text-muted-foreground">{occasion.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Suspense fallback={<ProductSkeletons count={8} />}>
            {products.length > 0 ? (
              products.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="text-muted-foreground mt-2">
                  We couldn't find any products for this occasion. Check back later!
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
    </>
  )
}
