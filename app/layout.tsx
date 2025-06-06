import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CategoryMegaMenu } from "@/components/category-mega-menu"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GiftGinnie - Find the Perfect Gift",
  description: "Discover unique and thoughtful gifts for every occasion",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <CategoryMegaMenu />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <style>
          {`
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}
        </style>
        <a
          href="https://wa.me/918000932933"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <img
            src="https://img.icons8.com/color/96/whatsapp--v1.png"
            alt="Chat on WhatsApp"
            width="60"
            height="60"
            style={{
              borderRadius: "50%",
              animation: "blink 1.5s infinite",
              WebkitAnimation: "blink 1.5s infinite",
            }}
          />
        </a>
      </body>
    </html>
  )
}
