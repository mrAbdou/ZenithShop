
import { InfiniteProductSchema } from '@/lib/schemas/product.schema';
import { z } from 'zod';

const args = {
    limit: 10,
    offset: 0,
    searchQuery: 'Gel',
    categoryId: 'cmk3o46840003bguqdg1fjh4r',
    minPrice: 8,
    maxPrice: 20
};

const validation = InfiniteProductSchema.safeParse(args);

if (!validation.success) {
    console.error('Validation failed:', validation.error);
} else {
    // Simulate resolver logic
    const where = {};
    const andConditions = [];

    if (validation.data.searchQuery) {
        andConditions.push({
            OR: [
                { name: { contains: validation.data.searchQuery, mode: 'insensitive' } },
                { description: { contains: validation.data.searchQuery, mode: 'insensitive' } }
            ]
        });
    }

    if (validation.data.minPrice || validation.data.maxPrice) {
        const priceCondition = {};
        if (validation.data.minPrice) {
            priceCondition.gte = validation.data.minPrice;
        }
        if (validation.data.maxPrice) {
            priceCondition.lte = validation.data.maxPrice;
        }
        andConditions.push({ price: priceCondition });
    }

    if (validation.data.categoryId) {
        andConditions.push({ categoryId: validation.data.categoryId });
    }

    if (andConditions.length > 0) {
        where.AND = andConditions;
    }
}
