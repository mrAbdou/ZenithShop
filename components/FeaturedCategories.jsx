'use client';
import { useFeaturedCategories } from '@/hooks/categories';
import { useTranslation } from '@/lib/i18n/context';

export default function FeaturedCategories({ initialData }) {
    const { data: categories, isLoading, error } = useFeaturedCategories({ head: 4 }, initialData);
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">{t('common.loading')}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-medium">{t('common.error')}</span>
                    {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">{t('home.featuredCategories')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories?.map((category) => (
                    <div
                        key={category.id}
                        className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold text-gray-600">
                                    {category.name.charAt(0)}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                            {category.name}
                        </h3>

                        <div className="mt-4 text-center text-sm text-gray-600">
                            {category.products.length} {t('home.products')}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
