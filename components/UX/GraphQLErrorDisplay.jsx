'use client';

import { useState, useEffect } from 'react';

// Development-only component to display GraphQL errors
export default function GraphQLErrorDisplay() {
    const [errors, setErrors] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV !== 'development') return;

        // Listen for custom error events
        const handleGraphQLError = (event) => {
            const { operation, error, variables } = event.detail;
            const errorEntry = {
                id: Date.now(),
                operation,
                error: error.message || 'Unknown error',
                variables,
                timestamp: new Date().toLocaleTimeString(),
                fullError: error
            };

            setErrors(prev => [errorEntry, ...prev].slice(0, 10)); // Keep last 10 errors
            setIsVisible(true);
        };

        window.addEventListener('graphql-error', handleGraphQLError);

        return () => {
            window.removeEventListener('graphql-error', handleGraphQLError);
        };
    }, []);

    // Don't render in production
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
            {/* Error Toggle Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className={`mb-2 px-3 py-2 rounded-lg text-white font-medium shadow-lg transition-all ${errors.length > 0
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
            >
                🚨 GraphQL Errors ({errors.length})
            </button>

            {/* Error Panel */}
            {isVisible && (
                <div className="bg-red-50 border border-red-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-red-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-red-800">GraphQL Errors</h3>
                        <button
                            onClick={() => setErrors([])}
                            className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Clear All
                        </button>
                    </div>

                    {errors.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">
                            No errors yet
                        </div>
                    ) : (
                        <div className="divide-y divide-red-200">
                            {errors.map((error) => (
                                <div key={error.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-red-800">
                                            {error.operation}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {error.timestamp}
                                        </span>
                                    </div>

                                    <div className="text-sm text-red-700 mb-2">
                                        {error.error}
                                    </div>

                                    {error.variables && Object.keys(error.variables).length > 0 && (
                                        <details className="mb-2">
                                            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                                Variables
                                            </summary>
                                            <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-x-auto">
                                                {JSON.stringify(error.variables, null, 2)}
                                            </pre>
                                        </details>
                                    )}

                                    <details>
                                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                            Full Error
                                        </summary>
                                        <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-x-auto">
                                            {JSON.stringify(error.fullError, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Utility function to dispatch GraphQL errors
export const dispatchGraphQLError = (operation, error, variables = {}) => {
    if (process.env.NODE_ENV === 'development') {
        window.dispatchEvent(new CustomEvent('graphql-error', {
            detail: { operation, error, variables }
        }));
    }
};