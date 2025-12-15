'use client';
import Link from "next/link";
import AddToCartButton from "./customer/AddToCartButton";

export default function Product({ product }) {
    return (
        <div
            key={product.id}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col"
        >
            {/* Gradient overlay decorativo */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full -z-10"></div>

            {/* Product Image Placeholder */}
            <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={`https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Badge de precio destacado */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                ${product.price}
            </div>

            {/* Contenido del producto */}
            <div className="mt-2 mb-3">
                <h2 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                </h2>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                {product.description}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col gap-2 mt-auto">
                <AddToCartButton product={product} />

                <Link
                    href={`/products/${product.id}`}
                    className="group/link relative bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-center transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden"
                >
                    {/* Efecto de brillo en hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/link:translate-x-[200%] transition-transform duration-700"></span>

                    <span className="relative flex items-center justify-center gap-2">
                        View Details
                        <svg
                            className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </span>
                </Link>
            </div>

            {/* Borde decorativo inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
}