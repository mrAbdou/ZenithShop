import { z } from "zod";
import { maxLimit, maxProductDescriptionLength, maxProductNameLength, minCurrentPage, minLimit, minPrice, minProductNameLength, productDescriptionRegex, productNameRegex, seachQueryMaxLength, searchQueryRegex } from "@/lib/constants";
//Tested and passed 100%
export const AddProductSchema = z.object({
    name: z
        .string('Name is required as string')
        .min(minProductNameLength, `Product name must be at least ${minProductNameLength} characters`)
        .max(maxProductNameLength, `Product name must be less than ${maxProductNameLength} characters`)
        .regex(productNameRegex, "Product name contains invalid characters"),
    description: z
        .string('Description is required as string')
        .max(maxProductDescriptionLength, `Description must be less than ${maxProductDescriptionLength} characters`)
        .regex(productDescriptionRegex, "Product Description contains invalid characters")
        .optional(),
    price: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number('Price is required as number')
        .min(0.01, "Price must be greater than 0")),
    qteInStock: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return parseInt(val);
    }, z.number('Quantity in stock is required')
        .int('Quantity in stock must be an integer')
        .min(1, "Quantity in stock must be at least 1"))
})
//Tested and passed 100%
export const UpdateProductSchema = z.object({
    name: z
        .string('Name should be a string')
        .min(minProductNameLength, `Product name must be at least ${minProductNameLength} characters`)
        .max(maxProductNameLength, `Product name must be less than ${maxProductNameLength} characters`)
        .regex(productNameRegex, "Product name contains invalid characters")
        .optional(),
    description: z
        .string('Description should be a string')
        .max(maxProductDescriptionLength, `Description must be less than ${maxProductDescriptionLength} characters`)
        .regex(productDescriptionRegex, "Product description contains invalid characters")
        .optional(),
    price: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Price should be a number')
        .min(0.01, "Price must be greater than 0"))
        .optional(),
    qteInStock: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.
        number('Quantity in stock should be a number').int('Quantity in stock must be an integer')
        .min(0, "Quantity in stock must be a positive number"))
        .optional()
});
//Tested and passed 100%
export const ProductPaginationSchema = z.object({
    //filtering props
    searchQuery: z.preprocess(
        value => (value && value !== "") ? value : undefined,
        z.string('Search query should be a string')
            .max(seachQueryMaxLength, "Search query is too long")
            .regex(searchQueryRegex, "Search query contains invalid characters")
            .optional()
    ),
    stock: z.enum(['', 'In Stock', 'Low Stock', 'Out Stock'], {
        message: 'Invalid option: expected one of ""|"In Stock"|"Low Stock"|"Out Stock"'
    }).optional(),
    startDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    endDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    //sorting props
    //this enum is defined to match what the CSR component table has offers to sort by
    sortBy: z.enum(['', 'id', 'name', 'price', 'stock', 'createdAt'], {
        message: 'Invalid option: expected one of ""|"id"|"name"|"price"|"stock"|"createdAt"'
    })
        .optional(),
    sortDirection: z.enum(['', 'asc', 'desc'], {
        message: 'Invalid option: expected one of ""|"asc"|"desc"'
    })
        .optional(),
    //pagination props
    limit: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Limit should be a number')
        .int('Limit should be an integer')
        .min(minLimit, `Limit should be at least ${minLimit}`)
        .max(maxLimit, `Limit should be at most ${maxLimit}`)),
    currentPage: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Current page should be a number')
        .int('Current page should be an integer')
        .min(minCurrentPage, `Current page should be at least ${minCurrentPage}`)),
}).refine(data => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
        return false;
    }
    return true;
}, {
    path: ['endDate'],
    message: 'Invalid date range'
}, ['endDate'])
    .refine(data => {
        if ((!data.sortBy && data.sortDirection) || (data.sortBy && !data.sortDirection)) {
            return false;
        }
        return true;
    }, {
        path: ['sortDirection'],
        message: 'Sort by and sort direction should be provided together'
    }, ['sortDirection']);

export const FilteringProductPaginationSchema = ProductPaginationSchema.pick({
    searchQuery: true,
    stock: true,
    startDate: true,
    endDate: true,
}).refine(data => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
        return false;
    }
    return true;
}, {
    path: ['endDate'],
    message: 'Invalid date range'
}, ['endDate'])
//Tested and passed 100%
export const InfiniteProductSchema = z.object({
    limit: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Limit should be a number')
        .int('Limit should be an integer')
        .min(minLimit, `Limit should be at least ${minLimit}`)
        .max(maxLimit, `Limit should be at most ${maxLimit}`)),
    offset: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Offset should be a number')
        .int('Offset should be an integer')
        .min(0, 'Offset should be at least 0')),
    //filtering props
    searchQuery: z.preprocess(
        value => (value && value !== "") ? value : undefined,
        z.string('Search query should be a string')
            .max(seachQueryMaxLength, "Search query is too long")
            .regex(searchQueryRegex, "Search query contains invalid characters")
            .optional()
    ),
    stock: z
        .enum(['', 'In Stock', 'Low Stock', 'Out Stock'], {
            message: 'Invalid option: expected one of ""|"In Stock"|"Low Stock"|"Out Stock"'
        })
        .optional(),
    minPrice: z.preprocess(val => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Min price should be a number')
        .min(minPrice, `Min price should be at least ${minPrice}`)
        .optional()),
    maxPrice: z.preprocess(val => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z
        .number('Max price should be a number')
        .min(0, 'Max price should be at least 0')
        .optional()),
    //sorting props
    sortBy: z
        .enum(['', 'name', 'price', 'stock', 'createdAt'], {
            message: 'Invalid option: expected one of ""|"name"|"price"|"stock"|"createdAt"'
        })
        .optional(),
    sortDirection: z
        .enum(['', 'asc', 'desc'], {
            message: 'Invalid option: expected one of ""|"asc"|"desc"'
        })
        .optional(),
})
    .refine(data => {
        if (data.minPrice && data.maxPrice && data.maxPrice < data.minPrice) {
            return false;
        }
        return true;
    }, {
        path: ['maxPrice'],
        message: 'Invalid price range'
    }, ['maxPrice'])
