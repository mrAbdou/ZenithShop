import { z } from "zod";
import { seachQueryMaxLength, searchQueryRegex } from "../constants";
export const CategoryFilterSchema = z.object({
    searchQuery: z.preprocess(val => {
        if (val === '' || val === undefined || val === null) return undefined;
        return String(val);
    }, z.string('Search query should be a string')
        .max(seachQueryMaxLength, `Search query should be at most ${seachQueryMaxLength} characters long`)
        .regex(searchQueryRegex, `Search query should only contain letters, numbers, spaces, and some special characters`)
        .optional()),
});

export const FeaturedCategoriesSchema = z.object({
    head: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number('Head should be a number')
        .int('Head should be an integer')
        .min(1, 'Head should be at least 1')
        .max(100, 'Head should be at most 100'))
});