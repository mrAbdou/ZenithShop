'use client';

import { useState } from 'react';

export default function ProductImageDisplay({ images, productName }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No images available</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="aspect-square bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
                <img
                    src={images[currentImageIndex]}
                    alt={`${productName} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover scale-95 hover:scale-100 transition-transform duration-500 rounded-lg"
                />
            </div>
            <div className="flex gap-3 mt-6 justify-center">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 p-2 ${index === currentImageIndex
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                ))}
            </div>
        </>
    );
}