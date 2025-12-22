//TODO: needs to be implemented.

import { describe, expect, it } from "vitest";
import { OrderItemSchema } from "../orderItem.schema";
describe('Order Item Schema Tests', () => {
    describe('Quantity Field Tests', () => {
        it('should validate invalid for an order item with undefined quantity value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: undefined
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity is required as number');
        });
        it('should validate invalid for an order item with null quantity value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: null
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity is required as number');
        });
        it('should validate invalid for an order item without specified quantity', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity is required as number');
        });
        it('should validate invalid for an order item with quantity equals to 0', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: 0
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity must be greater than 0');
        });
        it('should validate valid for an order item with quantity with string number value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: '1'
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid for an order item with quantity has string text value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: 'fourty handred and one'
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity is required as number');
        });
        it('should validate invalid for an order item with quantity has decimal value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: 1.5
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity must be an integer');
        });
        it('should validate invalid for an order item with quantity has negative value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: -1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity must be greater than 0');
        });
        it('should validate valid for correct quantity value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: 1
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid for wrong quantity value as boolean true', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: true
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity is required as number');
        });
        it('should validate invalid for wrong quantity value as boolean false', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: false
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity is required as number');
        });
        it('should validate invalid for quantity takes a whitespace string', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: ' '
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity must be greater than 0');
        })
        it('should validate invalid for quantity takes an empty string', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: ''
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Quantity must be greater than 0');
        })

    });
    describe('Product ID Field Tests', () => {
        it('should validate invalid for wrong productId value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 100,
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a string');
        });
        it('should validate invalid for null productId value', () => {
            const result = OrderItemSchema.safeParse({
                productId: null,
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a string');
        });
        it('should validate invalid for undefined productId value', () => {
            const result = OrderItemSchema.safeParse({
                productId: undefined,
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a string');
        });
        it('should validate invalid for empty productId value', () => {
            const result = OrderItemSchema.safeParse({
                productId: '',
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a valid string');
        });
        it('should validate invalid for productId without value', () => {
            const result = OrderItemSchema.safeParse({
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a string');
        });
        it('should validate invalid for missing product ID', () => {
            const result = OrderItemSchema.safeParse({
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a string');
        });
        it('should validate invalid for short productId string value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008',
                qte: 1
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Product ID must be a valid string');
        });
        it('should validate valid for long productId string value', () => {
            const result = OrderItemSchema.safeParse({
                productId: 'cl02hc0at00008x088j123456',
                qte: 1
            });
            expect(result.success).toBe(true);
        });

    })
});