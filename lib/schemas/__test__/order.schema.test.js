import { describe, it, expect } from "vitest";
import { CreateOrderSchema } from "../order.schema";

describe("Create Order Schema Tests", () => {
    describe('Total Field', () => {
        it('should validate invalid when creating order with empty items', () => {
            const result = CreateOrderSchema.safeParse({
                total: 0,
                items: []
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('It\'s impossible to create order with no selected product');
        });
        it('should validate valid when creating order with some items', () => {
            const result = CreateOrderSchema.safeParse({
                total: 0,
                items: [
                    {
                        productId: 'clp5v9k0e000008l2h3z5f7z1',
                        qte: 1,
                    }
                ]
            });
            expect(result.success).toBe(true);
        });
    })
});