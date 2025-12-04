import ProductsListing from "@/components/ProductsListing";
import { useProductsCount } from "@/lib/tanStackHooks/products";
export const metadata = {
  title: "Products",
  description: "Products",
}
export default async function ProductsPage() {
  const productsCount = await useProductsCount();
  console.log('from app/products/page.js products count : ', productsCount)
  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-12 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Products</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Explore our complete collection of premium products, each crafted with care and attention to detail.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="bg-white px-4 py-2 rounded-full shadow-md font-semibold text-gray-700">
              {productsCount} Products Available
            </span>
            <span className="bg-green-100 px-4 py-2 rounded-full text-green-700 font-semibold">
              ✓ Always Fresh Stock
            </span>
          </div>
        </div>
      </div>
      <ProductsListing />
    </div>
  );
}
