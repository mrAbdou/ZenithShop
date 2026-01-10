import { z } from "zod";
import { addressRegex, maxLengthAddress, maxLengthUserName, maxLimit, minCurrentPage, minLengthAddress, minLengthUserName, minLimit, phoneNumberRegex, seachQueryMaxLength, searchQueryRegex, userNameRegex } from "@/lib/constants";

export const CompleteSignUpSchema = z.object({
    phoneNumber: z
        .string('Phone number is required as String')
        .transform((val) => val.replace(/[\s\-\(\)]/g, '')) // Remove formatting like 0556-666666 or (0556)666666 to become 0556666666
        .refine((val) => phoneNumberRegex.test(val), "Phone number must be 10 digits or +213 followed by 9 digits"),
    address: z
        .string('Address is required as String')
        .min(minLengthAddress, `Address must be at least ${minLengthAddress} characters long`)
        .max(maxLengthAddress, `Address must be less than ${maxLengthAddress} characters long`)
        .regex(addressRegex, "Address contains invalid characters")
})

export const UpdateCustomerSchema = z.object({
    name: z
        .string('Name is required')
        .min(minLengthUserName, `Name must be at least ${minLengthUserName} characters long`)
        .max(maxLengthUserName, `Name must be at most ${maxLengthUserName} characters long`)
        .regex(userNameRegex, "Name must contain only letters and spaces")
        .optional(),
    //you can't update email, this is a protected field and a key field for the account.
    //password update should be done through better auth functions not here.
    phoneNumber: z.string('Phone number is required')
        .regex(phoneNumberRegex, "Phone number must be 10 digits or +213 followed by 9 digits")
        .transform((val) => val.replace(/[\s\-\(\)]/g, '')) // Remove formatting like 0556-666666 or (0556)666666 to become 0556666666
        .optional(),
    address: z
        .string('Address is required')
        .min(minLengthAddress, `Address must be at least ${minLengthAddress} characters long`)
        .max(maxLengthAddress, `Address must be less than ${maxLengthAddress} characters long`)
        .regex(addressRegex, "Address contains invalid characters")
        .optional()
});

export const UserPaginationSchema = z.object({
    searchQuery: z
        .string('Search query must be a string')
        .max(seachQueryMaxLength, `Search query must be at most ${seachQueryMaxLength} characters long`)
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
            .min(minCurrentPage, `Current page must be at least ${minCurrentPage}`)),
    limit: z.preprocess(val => parseInt(val),
        z.number('Limit should be a number')
            .int('Limit must be an integer')
            .min(minLimit, `Limit must be at least ${minLimit}`)
            .max(maxLimit, `Limit must be at most ${maxLimit}`)),
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

export const FilteringUserPaginationSchema = z.object({
    searchQuery: z.preprocess(
        value => (value && value !== "") ? value : undefined,
        z.string('Search query must be a string')
            .max(seachQueryMaxLength, `Search query must be at most ${seachQueryMaxLength} characters long`)
            .regex(searchQueryRegex, 'Search query contains invalid characters')
            .optional()
    ),
    role: z.enum(['', "CUSTOMER", "ADMIN"], 'Role is invalid').optional(),
    startDate: z.preprocess((val) => val === "" || val === null || val === undefined ? undefined : new Date(val),
        z.date('Start date should be a date').optional()),
    endDate: z.preprocess((val) => val === "" || val === null || val === undefined ? undefined : new Date(val),
        z.date('End date should be a date').optional()),
}).refine((data) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) return false;
    return true;
}, {
    message: 'Start date must be before end date',
    path: ['endDate']
});

export const FeaturedUsersSchema = z.object({
    head: z
        .number('Head should be a number')
        .int('Head should be an integer')
        .min(4, 'Head should be at least 4')
        .max(10, 'Head should be at most 10'),
})