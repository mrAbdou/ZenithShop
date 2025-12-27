import { describe, expect, it } from "vitest";
import { CompleteSignUpSchema, UpdateCustomerSchema, UserPaginationSchema } from "../user.schema";
import { Role } from "@prisma/client";
import { maxLengthAddress } from "@/lib/constants";
describe("Update Customer Schema Tests", () => {
    it('should validate valid when all fields are omitted', () => {
        const result = UpdateCustomerSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it('should validate valid when only name is provided', () => {
        const result = UpdateCustomerSchema.safeParse({
            name: 'John Doe'
        });
        expect(result.success).toBe(true);
    });

    it('should validate valid when only phoneNumber is provided', () => {
        const result = UpdateCustomerSchema.safeParse({
            phoneNumber: '0556174870'
        });
        expect(result.success).toBe(true);
    });

    it('should validate valid when only address is provided', () => {
        const result = UpdateCustomerSchema.safeParse({
            address: '123 Main Street, City'
        });
        expect(result.success).toBe(true);
    });

    it('should validate valid when all fields are provided correctly', () => {
        const result = UpdateCustomerSchema.safeParse({
            name: 'John Doe',
            phoneNumber: '+213456789011',
            address: '123 Main Street, City 12345'
        });
        expect(result.success).toBe(true);
    });

    describe('Name Field', () => {
        it('should validate invalid for name too short', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: ''
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Name must be at least 3 characters long');
        });

        it('should validate invalid for name too long', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: 'a'.repeat(51)
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Name must be at most 50 characters long');
        });

        it('should validate invalid for name with invalid characters', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: 'John Doe 123'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Name must contain only letters and spaces');
        });

        it('should validate invalid for name with special characters', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: 'John@Doe'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Name must contain only letters and spaces');
        });

        it('should validate valid for Arabic name', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: 'عبد السلام'
            });
            expect(result.success).toBe(true);
        });

        it('should validate valid for French name', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: 'Émile Dupont'
            });
            expect(result.success).toBe(true);
        });

        it('should validate valid for English name', () => {
            const result = UpdateCustomerSchema.safeParse({
                name: 'John Doe'
            });
            expect(result.success).toBe(true);
        });
    });

    describe('Phone Number Field', () => {
        it('should validate invalid for invalid phone number format', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '123abc'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });

        it('should validate invalid for phone number with wrong country code', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '+123456789'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });

        it('should validate invalid for phone number too short', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '123456789'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });

        it('should validate invalid for phone number too long', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '123456789012'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });

        it('should validate valid for phone number without country code', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '0556174870'
            });
            expect(result.success).toBe(true);
            expect(result.data.phoneNumber).toBe('0556174870');
        });

        it('should validate valid for phone number with country code', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '+213456789011'
            });
            expect(result.success).toBe(true);
        });

        it('should transform phone number by removing formatting', () => {
            const result = UpdateCustomerSchema.safeParse({
                phoneNumber: '0556-174-870'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });
    });

    describe('Address Field', () => {
        it('should validate invalid for address too short', () => {
            const result = UpdateCustomerSchema.safeParse({
                address: 'short'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Address must be at least 10 characters long');
        });

        it('should validate invalid for address too long', () => {
            const result = UpdateCustomerSchema.safeParse({
                address: 'a'.repeat(501)
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe(`Address must be less than ${maxLengthAddress} characters long`);
        });

        it('should validate invalid for address with invalid characters', () => {
            const result = UpdateCustomerSchema.safeParse({
                address: 'Address with @ symbol'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Address contains invalid characters');
        });

        it('should validate valid for Arabic address', () => {
            const result = UpdateCustomerSchema.safeParse({
                address: 'حي الحياة في قسنطينة'
            });
            expect(result.success).toBe(true);
        });

        it('should validate valid for French address', () => {
            const result = UpdateCustomerSchema.safeParse({
                address: 'rue de la liberté, Paris'
            });
            expect(result.success).toBe(true);
        });

        it('should validate valid for address with numbers and punctuation', () => {
            const result = UpdateCustomerSchema.safeParse({
                address: '123 شارع الحرية، الجزائر 16000'
            });
            expect(result.success).toBe(true);
        });
    });
});
describe('User Pagination Schema Tests', () => {
    describe('Valid cases', () => {
        it('should validate valid when only currentPage and limit are provided', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 1,
                limit: 5
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when all fields are provided', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'John Doe',
                role: Role.CUSTOMER,
                startDate: new Date(),
                endDate: new Date(),
                sortBy: 'createdAt',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 5
            });
            expect(result.success).toBe(true);
        });
    });
    describe('searchQuery tests', () => {
        it('should validate valid when searchQuery has letters and spaces', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'John Doe',
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        })
        it('should validate valid when searchQuery has string numbers', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: '123',
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when searchQuery has numbers', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 123,
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Search query must be a string');
        })
        it('should validate valid when searchQuery has apostrophes and hyphens', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: "l'espace socio-economique",
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when searchQuery has French text (accents)', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: "l'été à l'université",
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when searchQuery has arabic text', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'مرحبا',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when searchQuery has multiple words and spaces', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'The quick brown fox jumps over the lazy dog',
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when searchQuery did not provided', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when searchQuery is null', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: null,
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Search query must be a string');
        });
        it('should validate invalid when searchQuery has some forbidden chars used in the text', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: `alert('#XSS@searchQuery');`,
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Search query contains invalid characters');
        });
        it('should validate invalid when searchQuery text is too long', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'The quick brown fox jumps over the lazy dog and then it decides to take a long nap under the warm sun while the other animals play around in the green field',
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Search query must be at most 100 characters long');
        });
        it('should validate invalid when searchQuery has invalid regex chars', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: '#invalid_search_query*',
                limit: 5,
                currentPage: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Search query contains invalid characters');
        });
    });
    describe('role tests', () => {
        it('should validate valid when role takes CUSTOMER', () => {
            const result = UserPaginationSchema.safeParse({
                role: Role.CUSTOMER,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        })
        it('should validate valid when role takes ADMIN', () => {
            const result = UserPaginationSchema.safeParse({
                role: Role.ADMIN,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        })
        it('should validate valid when role did not provided', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        })
        it('should validate invalid when role is null', () => {
            const result = UserPaginationSchema.safeParse({
                role: null,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Role is invalid');
        });
        it('should validate invalid when role takes wrong value', () => {
            const result = UserPaginationSchema.safeParse({
                role: 'GUEST',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Role is invalid');
        });
        it('should validate invalid when role takes number instead of string', () => {
            const result = UserPaginationSchema.safeParse({
                role: 1,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Role is invalid');
        });
    });
    describe('startDate tests', () => {
        it('should validate valid when startDate takes ISO string', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: '2025-12-25T14:41:37.000Z',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when startDate takes Date object', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: new Date('2025-12-25T14:41:37.000Z'),
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when startDate takes only startDate (no endDate)', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: '2025-12-25T14:41:37.000Z',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when startDate did not provided', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when startDate is null', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: null,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when startDate takes non-date string', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: 'invalid_date_string',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Start date should be a date');
        });
        it('should validate invalid when startDate is after endDate', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: '2025-12-25T14:41:37.000Z',
                endDate: '2025-12-24T14:41:37.000Z',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Start date must be before end date');
        });
    });
    describe('endDate tests', () => {
        it('should validate valid when endDate takes ISO string', () => {
            const result = UserPaginationSchema.safeParse({
                endDate: '2025-12-25T14:41:37.000Z',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when endDate takes Date object', () => {
            const result = UserPaginationSchema.safeParse({
                endDate: new Date('2025-12-25T14:41:37.000Z'),
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when endDate takes only endDate (no startDate)', () => {
            const result = UserPaginationSchema.safeParse({
                endDate: '2025-12-25T14:41:37.000Z',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when endDate did not provided', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when endDate is null', () => {
            const result = UserPaginationSchema.safeParse({
                endDate: null,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when endDate takes non-date string', () => {
            const result = UserPaginationSchema.safeParse({
                endDate: 'invalid_date_string',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('End date should be a date');
        });
        it('should validate invalid when endDate is before startDate', () => {
            const result = UserPaginationSchema.safeParse({
                startDate: '2025-12-25T14:41:37.000Z',
                endDate: '2025-12-24T14:41:37.000Z',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Start date must be before end date');
        });
    });
    describe('sortBy tests', () => {
        it('should validate valid when sortBy takes name and sort direction takes asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'name',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortBy takes name without sort direction', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'name',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate valid when sortBy takes email and sort direction takes asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'email',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortBy takes email and without sort direction', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'email',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate valid when sortBy takes createdAt and sort direction takes asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'createdAt',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortBy takes createdAt and without sort direction', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'createdAt',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate valid when sortBy takes role and sort direction takes asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'role',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortBy takes role and without sort direction', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'role',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate invalid when sortBy takes empty string and sort direction takes asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: '',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate valid when sortBy did not provided', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortBy is null and without sort direction', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: null,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, name, email, createdAt, role');
        });
        it('should validate invalid when sortBy is null and sort direction is asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: null,
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, name, email, createdAt, role');
        });
        it('should validate invalid when sortBy takes wrong field with sort direction asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'invalid',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, name, email, createdAt, role');
        });
        it('should validate invalid when sortBy takes wrong field without sort direction', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'invalid',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, name, email, createdAt, role');
        });
        it('should validate invalid when sortBy takes a numeric value', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 1,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, name, email, createdAt, role');
        });
        it('should validate invalid when sortBy provided without sortDirection', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'name',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
    });
    describe('sortDirection tests', () => {
        it('should validate valid when sortDirection takes asc', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'name',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortDirection takes asc without sortBy', () => {
            const result = UserPaginationSchema.safeParse({
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate valid when sortDirection takes desc with sortBy name', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'name',
                sortDirection: 'desc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortDirection takes desc without sortBy', () => {
            const result = UserPaginationSchema.safeParse({
                sortDirection: 'desc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate invalid when sortDirection takes empty string with sortBy name', () => {
            const result = UserPaginationSchema.safeParse({
                sortBy: 'name',
                sortDirection: '',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate invalid when sortDirection takes empty string without sortBy', () => {
            const result = UserPaginationSchema.safeParse({
                sortDirection: '',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate valid when sortDirection is omitted', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sortDirection is null', () => {
            const result = UserPaginationSchema.safeParse({
                sortDirection: null,
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort direction should be one of asc, desc');
        });
        it('should validate invalid when sortDirection takes wrong value', () => {
            const result = UserPaginationSchema.safeParse({
                sortDirection: 'ascending',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort direction should be one of asc, desc');
        });
        it('should validate invalid when sortDirection provided without sortBy', () => {
            const result = UserPaginationSchema.safeParse({
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
    });
    describe('currentPage tests', () => {
        it('should validate valid when currentPage takes 1 with valid limit 5', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 1,
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when currentPage takes 1 without limit', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Limit should be a number');
        });
        it('should validate invalid when currentPage takes 5 without limit', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 5,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Limit should be a number');
        });
        it('should validate valid when currentPage takes 5 with limit 5', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 5,
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when currentPage takes 0 (below min) without limit', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 0,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page must be at least 1');
            expect(result.error.issues[1].message).toBe('Limit should be a number');
        });
        it('should validate invalid when currentPage takes -1 (negative) without limit', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: -1,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page must be at least 1');
            expect(result.error.issues[1].message).toBe('Limit should be a number');
        });
        it('should validate invalid when currentPage takes "1" (string) without limit', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: "1",
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Limit should be a number');
        });
        it('should validate valid when currentPage takes "1" (string) with limit 5', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: "1",
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when currentPage takes 1.5 (float) without limit', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 1.5,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Limit should be a number');
        });
        it('should validate valid when currentPage takes 1.5 (float) with limit 5', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: 1.5,
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when currentPage takes null', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: null,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit should be a number');
        });
        it('should validate invalid when currentPage takes undefined', () => {
            const result = UserPaginationSchema.safeParse({
                currentPage: undefined,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit should be a number');
        });
    });
    describe('limit tests', () => {
        it('should validate valid when limit takes 5 with currentPage 1', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when limit takes 5 with currentPage 1', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when limit takes 20 without currentPage', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 20,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
        });
        it('should validate invalid when limit takes 4 (below min)', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 4,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit must be at least 5');
        });
        it('should validate invalid when limit takes 21 (above max)', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 21,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit must be at most 20');
        });
        it('should validate invalid when limit takes -5 (negative)', () => {
            const result = UserPaginationSchema.safeParse({
                limit: -5,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit must be at least 5');
        });
        it('should validate valid when limit takes "10" (string) with currentPage 1', () => {
            const result = UserPaginationSchema.safeParse({
                limit: "10",
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when limit takes "10" (string) without currentPage', () => {
            const result = UserPaginationSchema.safeParse({
                limit: "10",
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
        });
        it('should validate valid when limit takes 10.5 (float) and currentPage takes 1', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 10.5,
                currentPage: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when limit takes 10.5 (float) without currentPage', () => {
            const result = UserPaginationSchema.safeParse({
                limit: 10.5,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
        });
        it('should validate invalid when limit takes null', () => {
            const result = UserPaginationSchema.safeParse({
                limit: null,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit should be a number');
        });
        it('should validate invalid when limit takes undefined', () => {
            const result = UserPaginationSchema.safeParse({
                limit: undefined,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(2);
            expect(result.error.issues[0].message).toBe('Current page should be a number');
            expect(result.error.issues[1].message).toBe('Limit should be a number');
        });
    });
    describe('Combination tests', () => {
        it('should validate valid when all fields are provided', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'test',
                role: Role.CUSTOMER,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-12-31'),
                sortBy: 'name',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when startDate is after endDate', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'test',
                role: Role.CUSTOMER,
                startDate: new Date('2022-12-31'),
                endDate: new Date('2022-01-01'),
                sortBy: 'name',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Start date must be before end date');
        });
        it('should validate invalid when sortBy is provided without sortDirection', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'test',
                role: Role.CUSTOMER,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-12-31'),
                sortBy: 'name',
                currentPage: 1,
                limit: 10,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        });
        it('should validate invalid when sortDirection is provided without sortBy', () => {
            const result = UserPaginationSchema.safeParse({
                searchQuery: 'test',
                role: Role.CUSTOMER,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-12-31'),
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Sort by and sort direction must be provided together');
        })
    });
});
describe('Complete sign up schema tests', () => {
    it('should validate valid when all required fields are provided', () => {
        const result = CompleteSignUpSchema.safeParse({
            phoneNumber: '0556666666',
            address: '123 Main St',
        });
        expect(result.success).toBe(true);
    });
    it('should validate invalid when all required fields are missing', () => {
        const result = CompleteSignUpSchema.safeParse({});
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(2);
        expect(result.error.issues[0].message).toBe('Phone number is required as String');
        expect(result.error.issues[1].message).toBe('Address is required as String');
    })
    describe('Phone number tests', () => {
        it('should validate valid when all required fields are provided, phoneNumber has the country code', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '+213556666666',
                address: '123 Main St',
            });
            expect(result.success).toBe(true);
        })
        it('should validate valid when all required fields are provided, phoneNumber has formatting', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556-66-66-66',
                address: '123 Main St',
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when phoneNumber is missing', () => {
            const result = CompleteSignUpSchema.safeParse({
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number is required as String');
        });
        it('should validate invalid when phoneNumber provided value is a number', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: Number('0556666666'),
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number is required as String');
        });
        it('should validate invalid when phoneNumber is short', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '055666666',
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });
        it('should validate invalid when phoneNumber is long', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666666',
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });
        it('should validate invalid when phoneNumber has wrong country code', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '+231556666666',
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        });
        it('should validate invalid when phoneNumber has wrong chars', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: 'zerofivefivefi',
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        })
        it('should validate invalid when phoneNumber has wrong formatting', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556.66.6.6.6.6',
                address: '123 Main St',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
        })


    })
    describe('Address tests', () => {
        it('should validate valid when all required fields are provided, address has formatting', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: '123 Main St (known as boulevard-stars)',
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when all required fields are provided, address in minimum length', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: '123 Main S',
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when all required fields are provided, address in maximum length', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: '123 Main S'.repeat(10),
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when all required fields are provided, address in arabic', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: 'حي الياسمين رقم 123',
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when all required fields are provided, address in french', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: 'cité des stars numéro 123',
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when address is missing', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Address is required as String');
        });
        it('should validate invalid when address provided value is a number', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: Number('123 Main St'),
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Address is required as String');
        });
        it('should validate invalid when address value is short', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: 'adr',
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Address must be at least 10 characters long');
        });
        it('should validate invalid when address value is long', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: 'a'.repeat(501),
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Address must be less than 500 characters');
        });
        it('should validate invalid when address has some forbidden chars', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: 'steet @123 Main St!',
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Address contains invalid characters');
        })
        it('should validate invalid when address has some forbidden formatting', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '0556666666',
                address: 'Address with\nnewline',
            });
            expect(result.success).toBe(false);
            expect(result.error.issues.length).toBe(1);
            expect(result.error.issues[0].message).toBe('Address contains invalid characters');
        });
        it('should validate valid when address has some forbidden formatting', () => {
            const result = CompleteSignUpSchema.safeParse({
                phoneNumber: '+213556666666',
                address: 'steet 123 Main St',
            });
            expect(result.success).toBe(true);
        });
        describe('edge cases tests', () => {
            it('should validate valid when phoneNumber has multiple spaces and hyphens', () => {
                const result = CompleteSignUpSchema.safeParse({
                    phoneNumber: '0556--666666',
                    address: 'adr'.repeat(10),
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid when address has exaclty the min length', () => {
                const result = CompleteSignUpSchema.safeParse({
                    phoneNumber: '0556666666',
                    address: 'a'.repeat(10),
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid when address has exaclty the max length', () => {
                const result = CompleteSignUpSchema.safeParse({
                    phoneNumber: '0556666666',
                    address: 'a'.repeat(500),
                });
                expect(result.success).toBe(true);
            });
        })
    })
});