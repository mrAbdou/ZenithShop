import { z } from "zod";
import { OrderItemSchema } from "./orderItem.schema";

export const CreateOrderSchema = z.object({
    total: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number('Total is required').min(0, "Total must be greater than 0")),
    items: z.array(OrderItemSchema).min(1, "It's impossible to create order with no selected product")
});

export const updateOrderSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
});

export const OrderFilterSchema = z.object({
    //filtering props
    searchQuery: z.string().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']).optional(),
    startDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    endDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    //sorting props
    sortBy: z.string().nullable().optional(),
    sortDirection: z.enum(['asc', 'desc']).nullable().optional(),
    //pagination props
    currentPage: z.number().optional(),
    limit: z.number().optional(),
    totalPages: z.number().optional(),
})
    .refine((data) => {
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
            return false;
        }
        return true;
    }, {
        message: "End date cannot be before start date",
        path: ["endDate"],
    });