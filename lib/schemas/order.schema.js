import { z } from "zod";
import { OrderItemSchema } from "./orderItem.schema";
import { maxLimit, minCurrentPage, minLimit, minOrderTotalPrice, seachQueryMaxLength, searchQueryRegex } from "@/lib/constants";
//100% tested and confirmed
export const CreateOrderSchema = z.object({
    total: z
        .preprocess((val) => {
            if (val === '' || val === undefined || val === null) return undefined;
            return Number(val);
        }, z
            .number('Total is required as number')
            .min(minOrderTotalPrice, `Total must be greater than ${minOrderTotalPrice}`)),
    items: z
        .array(OrderItemSchema, { message: "It's impossible to create order with no selected product" })
        .min(1, "It's impossible to create order with no selected product")
}).refine((data) => {
    if ((data.items.length > 0 && data.total === 0) || (data.items.length === 0 && data.total !== 0)) {
        return false;
    }
    return true;
}, {
    message: "Total does not match the sum of item prices",
    path: ["total"],
});

//100% tested and confirmed
export const updateOrderSchema = z.object({
    status: z.preprocess(
        (val) => {
            if (val === '' || val === undefined || val === null) return undefined;
            return val.toUpperCase();
        },
        z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'], {
            message: "Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED",
        })
    ),
});

//TODO: needs to be tested and confirmed
export const OrderFilterSchema = z.object({
    //filtering props
    searchQuery: z
        .string('Search query should be a string')
        .regex(searchQueryRegex, 'Search query can only contain letters (English, French, Arabic), numbers, spaces, and basic punctuation (hyphens, apostrophes, commas, periods, question marks, exclamation marks, colons, semicolons)')
        .max(seachQueryMaxLength, `Search query cannot exceed ${seachQueryMaxLength} characters`)
        .nullable()
        .optional(),
    status: z
        .preprocess((val) => {
            if (val === '' || val === undefined || val === null) return undefined;
            return val.toUpperCase();
        }, z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'], {
            message: "Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED",
        }))
        .nullable()
        .optional(),
    startDate: z
        .preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date('Start date should be a date').optional()),
    endDate: z
        .preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date('End date should be a date').optional()),
    //sorting props
    sortBy: z
        .enum(['id', 'user.name', 'createdAt', 'status', 'total', 'items'], {
            message: "Sort by should be one of id, user.name, createdAt, status, total, items",
        })
        .nullable()
        .optional(),
    sortDirection: z
        .enum(['asc', 'desc'], {
            message: "Sort direction should be one of asc or desc",
        })
        .nullable()
        .optional(),
    //pagination props
    currentPage: z
        .number('Current page should be a number')
        .min(minCurrentPage, `Current page must be greater than ${minCurrentPage}`)
        .optional(),
    limit: z
        .number('Limit should be a number')
        .min(minLimit, `Limit should be greater than ${minLimit}`)
        .max(maxLimit, `Limit should be less than ${maxLimit}`)
        .optional(),
})
    //check start date must be before end date
    .refine((data) => {
        if (data.startDate && data.endDate && data.endDate <= data.startDate) {
            return false;
        }
        return true;
    }, {
        message: "End date cannot be before start date or equal to",
        path: ["endDate"],
    })
    //check sort by and sort direction must be provided together
    .refine((data) => {
        if ((data.sortBy && !data.sortDirection) || (!data.sortBy && data.sortDirection)) {
            return false;
        }
        return true;
    }, {
        message: "Both sort by and sort direction must be provided together for sorting",
        path: ["sortDirection"],
    })
    //check filter dates cannot be in the future
    .refine((data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today

        if (data.startDate && data.startDate > today) {
            return false;
        }
        if (data.endDate && data.endDate > today) {
            return false;
        }
        return true;
    }, {
        message: "Filter dates cannot be in the future (orders cannot be created for future dates)",
        path: ["endDate"],
    })
    .refine((data) => {
        if (data.currentPage && data.limit) {
            return true;
        }
        return false;
    }, {
        message: "Both current page and limit must be provided together when filtering or sorting",
        path: ["currentPage"],
    });

export const FilteredOrdersCountSchema = OrderFilterSchema.pick({
    searchQuery: true,
    status: true,
    startDate: true,
    endDate: true
})
    //check start date must be before end date
    .refine((data) => {
        if (data.startDate && data.endDate && data.endDate <= data.startDate) {
            return false;
        }
        return true;
    }, {
        message: "End date cannot be before start date or equal to",
        path: ["endDate"],
    })
    //check filter dates cannot be in the future
    .refine((data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today

        if (data.startDate && data.startDate > today) {
            return false;
        }
        if (data.endDate && data.endDate > today) {
            return false;
        }
        return true;
    }, {
        message: "Filter dates cannot be in the future (orders cannot be created for future dates)",
        path: ["endDate"],
    })

