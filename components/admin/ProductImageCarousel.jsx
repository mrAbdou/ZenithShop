'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductImageCarousel({ images, productName }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigateImage = (direction) => {
        setCurrentImageIndex((prev) => {
            const newIndex = prev + direction;
            if (newIndex < 0) return images.length - 1;
            if (newIndex >= images.length) return 0;
            return newIndex;
        });
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="lg:col-span-3 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                        <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {images.length} image{images.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="relative">
                        {/* Main Image Display */}
                        <div className="relative overflow-hidden rounded-xl bg-white border-4 border-gray-200 shadow-inner p-4 h-[500px]">
                            <div className="absolute inset-4 rounded-lg overflow-hidden bg-gray-50 border-2 border-gray-100 shadow-sm relative w-full h-full">
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={`${productName} - Image ${currentImageIndex + 1}`}
                                    fill
                                    className="object-contain transition-opacity duration-300"
                                    priority={currentImageIndex === 0}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => navigateImage(-1)}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => navigateImage(1)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                                            ? 'border-purple-500 ring-2 ring-purple-200'
                                            : 'border-gray-300 hover:border-gray-400 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Image Counter */}
                        {images.length > 1 && (
                            <div className="absolute bottom-[5.5rem] left-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-medium z-10 pointer-events-none">
                                <span>{currentImageIndex + 1}</span> / {images.length}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
