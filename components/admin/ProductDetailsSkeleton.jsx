export default function ProductDetailsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                {/* Product ID and Name */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-28 animate-pulse"></div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
        </div>
    );
}