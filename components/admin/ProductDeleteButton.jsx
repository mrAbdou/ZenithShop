'use client';

import { useDeleteProduct } from "@/hooks/products";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n/context";

export default function ProductDeleteButton({ productId, productName }) {
    const { t } = useTranslation();
    const { mutateAsync: deleteProductAsync, isPending } = useDeleteProduct();

    const onDeleteProduct = async (id) => {
        if (window.confirm(t('admin.products.deleteConfirm'))) {
            try {
                await deleteProductAsync(id, {
                    onSuccess: () => {
                        toast.success(t('admin.products.productDeleted'));
                        // Navigate back to products list after successful deletion
                        window.location.href = '/control-panel/products';
                    },
                    onError: (error) => {
                        toast.error(error?.message || t('admin.products.deleteFailed'));
                    }
                });
            } catch (error) {
                toast.error(t('admin.products.deleteFailed'));
            }
        }
    };

    return (
        <button
            onClick={() => onDeleteProduct(productId)}
            disabled={isPending}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            {isPending ? (
                <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('admin.products.deleting')}
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t('admin.products.deleteProduct')}
                </>
            )}
        </button>
    );
}
