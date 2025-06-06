"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/utils/FetchNodeServices"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])

  useEffect(()=>{
   const fetchBanner = async()=>{
     const response = await apiClient('GET', `/api/banner`);
    if(response.ok)
    {
      setSlides(response.data)
    }
   }

   fetchBanner()
  },[])
  // const slides = [
  //   {
  //     title: "Find the Perfect Gift",
  //     description: "Discover unique and thoughtful gifts for every occasion",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1744180313/nlcuanavirnwyx6zablq.jpg",
  //     cta: "/products",
  //     ctaText: "Shop Now",
  //   },
  //   {
  //     title: "Personalized Gifts",
  //     description: "Make it special with our customizable gift options",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1744180292/hfqoiucqnrzcbdm2ykra.jpg",
  //     cta: "/categories/personalized",
  //     ctaText: "Explore",
  //   },
  //   {
  //     title: "Gift Sets & Bundles",
  //     description: "Curated collections for every taste and preference",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1743749546/s0gvih4ty2zpwnvhkffa.jpg",
  //     cta: "/categories/gift-sets",
  //     ctaText: "View Collections",
  //   },
    
  //   {
  //     title: "Gift Sets & Bundles",
  //     description: "Curated collections for every taste and preference",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1743749004/qevsdvagxnew2co7o5gn.jpg",
  //     cta: "/categories/gift-sets",
  //     ctaText: "View Collections",
  //   },
    
  //   {
  //     title: "Gift Sets & Bundles",
  //     description: "Curated collections for every taste and preference",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1743748569/jvydnq3x4x0a3to8g18p.jpg",
  //     cta: "/categories/gift-sets",
  //     ctaText: "View Collections",
  //   },
    
  //   {
  //     title: "Gift Sets & Bundles",
  //     description: "Curated collections for every taste and preference",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1743495411/onxiuv9bdyilsdtkgdpn.jpg",
  //     cta: "/categories/gift-sets",
  //     ctaText: "View Collections",
  //   },
    
  //   {
  //     title: "Gift Sets & Bundles",
  //     description: "Curated collections for every taste and preference",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1743485158/nqribzzzzw76xumxqy2y.jpg",
  //     cta: "/categories/gift-sets",
  //     ctaText: "View Collections",
  //   },
  //   {
  //     title: "Gift Sets & Bundles",
  //     description: "Curated collections for every taste and preference",
  //     image: "https://res.cloudinary.com/dpzwcegco/image/upload/v1742541945/wb5g0i6ryqfyt6wttksz.jpg",
  //     cta: "/categories/gift-sets",
  //     ctaText: "View Collections",
  //   },
  // ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {slides?.map((slide:any, index:number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={slide?.image || "/placeholder.svg"} alt={slide.title} className="object-cover w-full h-full" />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center text-white space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                {/* {slide.title} */}
                </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {/* {slide.description} */}
              </p>
              <div className="flex justify-center gap-2 pt-4">
                <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                  <Link href={"/products"}>
                    {/* {slide.ctaText} */}
                    View Collections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
