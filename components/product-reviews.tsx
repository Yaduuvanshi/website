"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/utils/FetchNodeServices"

interface ProductReviewsProps {
  productId: string
}

interface Review {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  rating: number
  comment: string
  product: string
  createdAt: string
  updatedAt: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient("GET", `/api/review/product/${productId}`)
        if (response.ok) {
          setReviews(response.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch reviews",
            variant: "destructive",
          })
        }
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch reviews",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [productId, toast])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Star rating missing",
        description: "Please choose a star rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiClient("POST", "/api/review", {
        productId,
        rating: rating.toString(),
        comment: reviewText,
      });
      /* ---------- SUCCESS ---------- */
      if (res.ok) {
        toast({
          title: "Review submitted",
          description: res.message /* “Thanks! Your review has been added.” */,
        });

        setRating(0);
        setReviewText("");

        /* refresh list */
        const list = await apiClient("GET", `/api/review/product/${productId}`);
        list.ok && setReviews(list.data);
        return;
      }

      /* ---------- KNOWN ERRORS ---------- */
      switch (res.code) {
        case "NOT_PURCHASED":
          toast({
            title: "Purchase required",
            description: res.message, // “You can review a product only after …”
            variant: "destructive",
          });
          break;

        case "ALREADY_REVIEWED":
          toast({
            title: "Already reviewed",
            description: res.message, // “You have already reviewed this product.”
            variant: "destructive",
          });
          break;

        case "FIELDS_MISSING":
          toast({
            title: "Details missing",
            description: res.message,
            variant: "destructive",
          });
          break;

        case "PRODUCT_NOT_FOUND":
          toast({
            title: "Product not found",
            description: res.message,
            variant: "destructive",
          });
          break;

        default:
          throw new Error(res.message || "Unexpected error");
      }
    } catch (err: any) {
      console.error("Review error:", err?.message);

      const status = err?.response?.status;
      const msg =
        status === 400
          ? "You have already reviewed this product."
          : err?.response?.data?.message ||
          err?.message ||
          "You can review a product only after you have bought and received it.";

      toast({
        title: status === 401
          ? "Login required"
          : status === 400
            ? "Review already submitted"
            : "Could not submit review",
        description:
          status === 401
            ? "Please login and then try reviewing again."
            : msg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      <div className="space-y-6">
        {isLoading ? (
          <div>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div>No reviews yet. Be the first to review this product!</div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                          }`}
                      />
                    ))}
                </div>
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Rating</p>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-1"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={`h-6 w-6 ${i < (hoveredRating || rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                        }`}
                    />
                  </button>
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Review
            </label>
            <Textarea
              id="review"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  )
}
