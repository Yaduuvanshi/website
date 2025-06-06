import { notFound } from "next/navigation";
import { apiClient } from "@/utils/FetchNodeServices";
import ProductGrid from "./ProductGrid";

async function getSubCategory(id: string) {
  const res = await apiClient("GET", `/api/subCategory/single/${id}`);
  if (!res.ok) return null;
  return res;
}

export default async function SubCategoryPage({ params }: { params: { id: string } }) {
  const response = await getSubCategory(params?.id);

  if (!response || !response.data) {
    notFound();
  }

  const subCategory = response.data;
  const products = subCategory.products || [];

  return (
    <div className="container mx-auto py-10 px-4">
      <ProductGrid products={products} subCategory={subCategory} />
    </div>
  );
}
