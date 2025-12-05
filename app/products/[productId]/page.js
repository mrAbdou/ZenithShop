import Link from "next/link";
import AddToCartButton from "../../../components/AddToCartButton";
import { useProduct } from "@/lib/tanStackHooks/products";
export async function generateMetadata({ params }) {
  const { productId } = await params;
  return {
    title: `Product ${productId} details`,
    description: `Detailed information about product ${productId}`,
  };
}

export default async function ProductDetailsPage({ params }) {
  const { productId } = await params;
  const product = await useProduct(productId);
  console.log('from app/products/[productId]/page.js product : ', product);
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Images */}
          <div className="relative p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="aspect-square bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
              <img
                src={'./file.svg'}
                alt={product?.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-6 justify-center">
              {product?.images?.map((image, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors p-2"
                >
                  <img src={'./file.svg'} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-3">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${product.qteInStock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {product.qteInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <AddToCartButton product={product} />
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Products
                </Link>
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">You might also like</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img src={`/next.svg`} alt="Related product" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 truncate">Related Product {i}</h3>
              <p className="text-blue-600 font-bold">${(Math.random() * 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
