import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function OccasionsPage() {
  // Mock occasions data
  const occasions = [
    {
      id: "birthday",
      name: "Birthday Gifts",
      description: "Find the perfect birthday gift for your loved ones",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "anniversary",
      name: "Anniversary Gifts",
      description: "Celebrate special milestones with our anniversary gift collection",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "wedding",
      name: "Wedding Gifts",
      description: "Unique and thoughtful wedding gifts for the happy couple",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "valentines",
      name: "Valentine's Day",
      description: "Express your love with our Valentine's Day gift selection",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "christmas",
      name: "Christmas Gifts",
      description: "Spread holiday cheer with our festive Christmas gifts",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "mothers-day",
      name: "Mother's Day",
      description: "Show your appreciation with our Mother's Day gift ideas",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "fathers-day",
      name: "Father's Day",
      description: "Find the perfect gift to celebrate dad",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "graduation",
      name: "Graduation Gifts",
      description: "Celebrate academic achievements with our graduation gifts",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gift Occasions</h1>
          <p className="text-muted-foreground">Find the perfect gift for every occasion</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Suspense fallback={<OccasionSkeletons count={8} />}>
            {occasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={`/occasions/${occasion.id}`}
                className="group relative flex flex-col overflow-hidden rounded-lg border"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={occasion.image || "/placeholder.svg"}
                    alt={occasion.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 p-4">
                  <h3 className="font-semibold">{occasion.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{occasion.description}</p>
                  <div className="flex items-center pt-2">
                    <span className="text-sm font-medium text-primary inline-flex items-center">
                      Browse Gifts
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function OccasionSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
    </>
  )
}
