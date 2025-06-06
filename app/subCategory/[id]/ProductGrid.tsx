"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCard = dynamic(() => import("@/components/product-card").then(mod => mod.ProductCard), {
  loading: () => (
    <div className="border rounded-lg p-4 shadow-sm">
      <Skeleton className="w-full h-48 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  ),
});

export default function ProductGrid({ products, subCategory }: { products: any[]; subCategory: any }) {
  return (
    <div>
      {/* Subcategory Header */}
      {/* <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{subCategory.name}</h1>
        <p className="text-gray-600 mb-4">{subCategory.description}</p>
        {subCategory.image && (
          <img
            src={subCategory.image}
            alt={subCategory.name}
            className="w-full max-w-xl rounded-lg shadow-md"
          />
        )}
      </div> */}
      {/* Products Section */}
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg font-medium">No products available in this subcategory.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 