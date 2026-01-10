import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedCategories, fetchCategories, countFilteredCategories } from '@/services/categories.client';
import { CategoryFilterSchema, FeaturedCategoriesSchema } from '@/lib/schemas/category.schema';
import ZodValidationError from '@/lib/ZodValidationError';

export function useFeaturedCategories(variables, initialData) {
    return useQuery({
        queryKey: ['featuredCategories', variables],
        queryFn: () => {
            const validation = FeaturedCategoriesSchema.safeParse(variables);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return fetchFeaturedCategories(validation.data);
        },
        initialData: initialData ?? []
    });
}

export function useCategories(variables, initialData) {
    return useQuery({
        queryKey: ['categories', variables],
        queryFn: () => {
            //TODO: create schema for checking this variables in here
            return fetchCategories(variables);
        },
        initialData: initialData ?? []
    });
}

export function useCountFilteredCategories(variables, initialData) {
    return useQuery({
        queryKey: ['countFilteredCategories', variables],
        queryFn: () => {
            const validation = CategoryFilterSchema.safeParse(variables);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return countFilteredCategories(validation.data);
        },
        initialData: initialData ?? []
    })
}