import { z } from "zod";
import { CATEGORY_REGEX, MAX_CATEGORY_NAME_LENGTH, MIN_CATEGORY_NAME_LENGTH, seachQueryMaxLength, searchQueryRegex } from "../constants";
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

export const CategoryCreateSchema = z.object({
    name: z.string('Name should be a string')
        .min(MIN_CATEGORY_NAME_LENGTH, `Name should be at least ${MIN_CATEGORY_NAME_LENGTH} characters long`)
        .max(MAX_CATEGORY_NAME_LENGTH, `Name should be at most ${MAX_CATEGORY_NAME_LENGTH} characters long`)
        .regex(CATEGORY_REGEX, 'Name should only contain letters, numbers, spaces, hyphens, and underscores')
});

export const CategoryUpdateSchema = z.object({
    name: z.string('Name should be a string')
        .min(MIN_CATEGORY_NAME_LENGTH, `Name should be at least ${MIN_CATEGORY_NAME_LENGTH} characters long`)
        .max(MAX_CATEGORY_NAME_LENGTH, `Name should be at most ${MAX_CATEGORY_NAME_LENGTH} characters long`)
        .regex(CATEGORY_REGEX, 'Name should only contain letters, numbers, spaces, hyphens, and underscores')
});