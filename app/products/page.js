import Product from "../../components/Product";

async function getProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: "query GetProducts { products { id name price description } }",
      }),
      cache: "no-store",
    });
    const json = await response.json();
    // console.log('JSON: ', json); // Removed debug log

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      return [];
    }
    return json.data?.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
export default async function ProductsPage() {
  const products = await getProducts();

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
              {products.length} Products Available
            </span>
            <span className="bg-green-100 px-4 py-2 rounded-full text-green-700 font-semibold">
              ✓ Always Fresh Stock
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
          <p className="text-gray-500">Check back soon for new arrivals!</p>
        </div>
      )}
    </div>
  );
}
