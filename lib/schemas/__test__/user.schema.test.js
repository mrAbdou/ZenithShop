import { describe, expect, it } from "vitest";
import { UpdateCustomerSchema } from "../user.schema";

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
            expect(result.error.issues[0].message).toBe('Address must be less than 500 characters');
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

