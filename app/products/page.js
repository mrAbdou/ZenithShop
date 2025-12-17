//start components import -----------------------------------------
import ProductsListing from "@/components/customer/ProductsListing";
import CartFloatingButton from "@/components/customer/CartFloatingButton";
//end components import -------------------------------------------

//start services import -------------------------------------------
import { fetchInfiniteProducts, fetchProductsCount } from "@/services/products.server";
//end services import ---------------------------------------------

//start next imports ---------------------------------------------
import { headers } from "next/headers";
//end next imports -----------------------------------------------

export const metadata = {
  title: "Products | ZenithShop",
  description: "Explore our complete collection of premium products at ZenithShop",
}
export default async function ProductsPage() {
  const h = await headers();
  const cookieHeader = h.get("cookie") || "";
  const productsCount = await fetchProductsCount(cookieHeader);
  const products = await fetchInfiniteProducts(cookieHeader);
  return (
    <div className="min-h-screen p-6 relative">
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
      <ProductsListing initialData={products} />

      {/* Floating Cart Button */}
      <CartFloatingButton />
    </div>
  );
}
