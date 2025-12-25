import { z } from "zod";
const searchQueryRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s\-'.,!?]+$/;

export const UpdateCustomerSchema = z.object({
    name: z
        .string('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must be at most 50 characters long')
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z\s]+$/, "Name must contain only letters and spaces")
        .optional(),
    //you can't update email, this is a protected field and a key field for the account.
    //password update should be done through better auth functions not here.
    phoneNumber: z.string('Phone number is required')
        .regex(/^(\+213[0-9]{9}|[0-9]{10})$/, "Phone number must be 10 digits or +213 followed by 9 digits")
        .transform((val) => val.replace(/[\s\-\(\)]/g, '')) // Remove formatting like 0556-666666 or (0556)666666 to become 0556666666
        .optional(),
    address: z
        .string('Address is required')
        .min(10, "Address must be at least 10 characters long")
        .max(500, "Address must be less than 500 characters")
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s,\.\-\(\)\/\\]+$/, "Address contains invalid characters")
        .optional()
});

export const UserPaginationSchema = z.object({
    searchQuery: z
        .string('Search query must be a string')
        .max(100, 'Search query must be at most 100 characters long')
        .regex(searchQueryRegex, 'Search query contains invalid characters')
        .optional(),
    role: z
        .enum(["CUSTOMER", "ADMIN"], 'Role is invalid')
        .optional(),
    startDate: z.preprocess((val) => val === "" || val === null || val === undefined ? undefined : new Date(val),
        z.date('Start date should be a date').optional()),
    endDate: z.preprocess((val) => val === "" || val === null || val === undefined ? undefined : new Date(val),
        z.date('End date should be a date').optional()),
    sortBy: z
        .enum(["", "id", "name", "email", "createdAt", 'role'], 'Sort by should be one of id, name, email, createdAt, role')
        .optional(),
    sortDirection: z
        .enum(["", "asc", "desc"], 'Sort direction should be one of asc, desc')
        .optional(),
    currentPage: z.preprocess(val => parseInt(val),
        z.number('Current page should be a number')
            .int('Current page must be an integer')
            .min(1, 'Current page must be at least 1')),
    limit: z.preprocess(val => parseInt(val),
        z.number('Limit should be a number')
            .int('Limit must be an integer')
            .min(5, 'Limit must be at least 5')
            .max(20, 'Limit must be at most 20')),
}).refine((data) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) return false;
    return true;
}, {
    message: 'Start date must be before end date',
    path: ['endDate']
})
    .refine(data => {
        const isSortByProvided = data.sortBy && data.sortBy !== "";
        const isSortDirectionProvided = data.sortDirection && data.sortDirection !== "";
        return isSortByProvided === isSortDirectionProvided;
    }, {
        message: 'Sort by and sort direction must be provided together',
        path: ['sortDirection']
    });

