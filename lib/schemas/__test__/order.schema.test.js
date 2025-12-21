import { describe, it, expect } from "vitest";
import { CreateOrderSchema } from "../order.schema";

describe("Create Order Schema Tests", () => {
    it('should validate invalid when creating order with empty items', () => {
        const result = CreateOrderSchema.safeParse({
            total: 0,
            items: []
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('It\'s impossible to create order with no selected product');
    });
    it('should validate valid when creating order with some items and total set to the sum of item prices', () => {
        const result = CreateOrderSchema.safeParse({
            total: 100.99,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        });
        expect(result.success).toBe(true);
    });
    it('should validate invalid when creating order with some items but total set to zero', () => {
        const result = CreateOrderSchema.safeParse({
            total: 0,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total does not match the sum of item prices');
    })
    it('should validate invalid when total set to the sum of prices of items but there is no item', () => {
        const result = CreateOrderSchema.safeParse({
            total: 100,
            items: []
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('It\'s impossible to create order with no selected product');
    });
    it('should validate invalid when creating order without providing total value', () => {
        const result = CreateOrderSchema.safeParse({
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total is required as number');
    })
    it('should validate invalid when creating order without providing items', () => {
        const result = CreateOrderSchema.safeParse({
            total: 100,
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('It\'s impossible to create order with no selected product');
    });
    it('should validate valid when creating order with string number as total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: '100',
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        });
        expect(result.success).toBe(true);
    });
    it('should validate invalid when creating order with string text as total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: 'hundred',
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total is required as number');
    });
    it('should validate invalid when creating order with too small total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: -99.99,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total must be greater than 0');
    });
    it('should validate valid with creating order with mutiple order item included', () => {
        const result = CreateOrderSchema.safeParse({
            total: 100.99,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                },
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z2',
                    qte: 2,
                }
            ]
        });
        expect(result.success).toBe(true);
    });
    it('should validate valid when creating order with too huge total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: 999999.99,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 15,
                },
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z2',
                    qte: 20,
                },
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z3',
                    qte: 30,
                },

            ]
        })
        expect(result.success).toBe(true);
    });
    it('should validate invalid when creating order with null total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: null,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total is required as number');
    });
    it('should validate invalid when creating order with undefined total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: undefined,
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total is required as number');
    });
    it('should validate invalid when creating order with empty total value', () => {
        const result = CreateOrderSchema.safeParse({
            total: '',
            items: [
                {
                    productId: 'clp5v9k0e000008l2h3z5f7z1',
                    qte: 1,
                }
            ]
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Total is required as number');
    });
    it('should validate invalid when creating order with null items value', () => {
        const result = CreateOrderSchema.safeParse({
            total: 99.99,
            items: null,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('It\'s impossible to create order with no selected product');
    });
    it('should validate invalid when creating order with undefined items value', () => {
        const result = CreateOrderSchema.safeParse({
            total: 99.99,
            items: undefined,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('It\'s impossible to create order with no selected product');
    });
});