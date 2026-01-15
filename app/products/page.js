//start components import -----------------------------------------
import CartFloatingButton from "@/components/customer/CartFloatingButton";
import ProductsPageClientWrapper from "@/components/customer/ProductsPageClientWrapper";
//end components import -------------------------------------------

//start services import -------------------------------------------
import { fetchInfiniteProducts, fetchProductsCount } from "@/services/products.server";
import { fetchCategories } from "@/services/categories.server";
//end services import ---------------------------------------------

//start next imports ---------------------------------------------
import { headers } from "next/headers";
import { LIMIT } from "@/lib/constants";
import { getTranslations } from "@/lib/i18n/server";
//end next imports -----------------------------------------------

export const metadata = {
  title: "Products | ZenithShop",
  description: "Explore our complete collection of premium products at ZenithShop",
}
export default async function ProductsPage() {
  const h = await headers();
  const cookieHeader = h.get("cookie") || "";
  const productsCount = await fetchProductsCount({}, cookieHeader);
  const products = await fetchInfiniteProducts({ limit: LIMIT, offset: 0 }, cookieHeader);
  const categories = await fetchCategories({}, cookieHeader);
  const t = await getTranslations('products');
  const commonT = await getTranslations('common');
  const titleParts = t.pageTitle.split(' ');
  return (
    <div className="min-h-screen p-6 relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-12 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {titleParts[0]}
            {titleParts[1] && <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> {titleParts[1]}</span>}
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            {t.pageSubtitle}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="bg-white px-4 py-2 rounded-full shadow-md font-semibold text-gray-700">
              {productsCount} {t.productsAvailable}
            </span>
            <span className="bg-green-100 px-4 py-2 rounded-full text-green-700 font-semibold">
              ✓ {t.alwaysFreshStock}
            </span>
          </div>
        </div>
      </div>
      <ProductsPageClientWrapper initialProducts={products} initialCategories={categories} translations={t} commonTranslations={commonT} />

      {/* Floating Cart Button */}
      <CartFloatingButton translations={t} />
    </div>
  );
}
