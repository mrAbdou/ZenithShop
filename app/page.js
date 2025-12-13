import CartFloatingButton from "@/components/CartFloatingButton";
import ProductsListing from "@/components/ProductsListing";
import { fetchProducts } from "@/services/products.server";
import { LIMIT } from "@/lib/constants";
import { headers } from "next/headers";

export const metadata = {
  title: "ZenithShop",
  description: "Shop premium products with fast shipping.",
  keywords: ["online store", "ecommerce", "premium products", "free shipping"],
  openGraph: {
    title: "ZenithShop",
    description: "Premium ecommerce store",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  }
};

export default async function Home() {
  const h = await headers();
  const cookieHeader = h.get("cookie") || "";
  let products = [];
  try {
    products = await fetchProducts(LIMIT, 0, cookieHeader);
    console.log('products :L', products);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
  return (
    <div className="min-h-screen p-6 relative">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to Our
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Store</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our premium collection of products. Quality, style, and value all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free Shipping
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Quality Guarantee
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30-Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Featured Products</h2>
        <p className="text-center text-gray-600 text-lg mb-12">Check out our most popular items</p>
      </div>
      <ProductsListing initialData={products} />

      {/* Floating Cart Button */}
      <CartFloatingButton />
    </div>
  );
}
