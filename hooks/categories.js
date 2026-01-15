import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFeaturedCategories, fetchCategories, countFilteredCategories, createCategory, updateCategory, fetchCategory, deleteCategory, fetchCategoriesCount } from '@/services/categories.client';
import { CategoryFilterSchema, FeaturedCategoriesSchema, CategoryCreateSchema, CategoryUpdateSchema } from '@/lib/schemas/category.schema';
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

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const validation = CategoryCreateSchema.safeParse(data);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            try {
                return await createCategory(validation.data);
            } catch (gqlError) {
                throw gqlError;
            }
        },
        onSuccess: (data) => {
            try {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                queryClient.invalidateQueries({ queryKey: ['countFilteredCategories'] });
            } catch (cacheError) {
                console.error('Cache Update Error : ', cacheError);
            }
        }
    })
}
export function useCategory(id, initialData) {
    return useQuery({
        queryKey: ['category', id],
        queryFn: async () => await fetchCategory({ id }),
        initialData: initialData ?? null,
        enabled: !!id,
    })
}
export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (variables) => {
            const { id, ...data } = variables;
            const validation = CategoryUpdateSchema.safeParse(data);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            try {
                return await updateCategory(variables);
            } catch (gqlError) {
                throw gqlError;
            }
        },
        onSuccess: (data) => {
            try {
                queryClient.setQueryData(['category', data.id], data);
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                queryClient.invalidateQueries({ queryKey: ['countFilteredCategories'] });
            } catch (cacheError) {
                console.error('Cache Update Error : ', cacheError);
            }
        }
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (!id || typeof id !== 'string') {
                throw new Error('Invalid category id');
            }
            try {
                return await deleteCategory({ id });
            } catch (gqlError) {
                throw gqlError;
            }
        },
        onSuccess: (data) => {
            try {
                queryClient.removeQueries({ queryKey: ['category', data.id] });
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                queryClient.invalidateQueries({ queryKey: ['countFilteredCategories'] });
            } catch (cacheError) {
                console.error('Cache Update Error : ', cacheError);
            }
        }
    })
}

export function useCategoriesCount(initialData) {
    return useQuery({
        queryKey: ['categoriesCount'],
        queryFn: fetchCategoriesCount,
        initialData: initialData ?? 0
    });
}