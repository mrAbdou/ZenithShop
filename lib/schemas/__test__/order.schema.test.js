import { describe, it, expect } from "vitest";
import { CreateOrderSchema, OrderFilterSchema, updateOrderSchema } from "../order.schema";
import { maxLimit, minCurrentPage, minLimit } from "@/lib/constants";

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

describe('Update Order Schema Tests', () => {
    it('should validate valid when updating order with PENDING status', () => {
        const result = updateOrderSchema.safeParse({
            status: 'PENDING',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when updating order with CONFIRMED status', () => {
        const result = updateOrderSchema.safeParse({
            status: 'CONFIRMED',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when updating order with SHIPPED status', () => {
        const result = updateOrderSchema.safeParse({
            status: 'SHIPPED',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when updating order with DELIVERED status', () => {
        const result = updateOrderSchema.safeParse({
            status: 'DELIVERED',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when updating order with CANCELLED status', () => {
        const result = updateOrderSchema.safeParse({
            status: 'CANCELLED',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when updating order with RETURNED status', () => {
        const result = updateOrderSchema.safeParse({
            status: 'RETURNED',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when updating order status with empty string', () => {
        const result = updateOrderSchema.safeParse({
            status: '',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED');
    });
    it('should validate invalid when updating order status with undefined', () => {
        const result = updateOrderSchema.safeParse({
            status: undefined,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED');
    });
    it('should validate invalid when updating order status with null', () => {
        const result = updateOrderSchema.safeParse({
            status: null,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED');
    });
    it('should validate invalid when you update order without passing a value for status', () => {
        const result = updateOrderSchema.safeParse({})
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED');
    });
    it('should validate invalid when updating order status with a typo', () => {
        const result = updateOrderSchema.safeParse({
            status: 'PENDINGD',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED');
    });
    it('should validate valid when you update order status with lowercase pending', () => {
        const result = updateOrderSchema.safeParse({
            status: 'pending',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when you update order status with lowercase confirmed', () => {
        const result = updateOrderSchema.safeParse({
            status: 'confirmed',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when you update order status with lowercase shipped', () => {
        const result = updateOrderSchema.safeParse({
            status: 'shipped',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when you update order status with lowercase delivered', () => {
        const result = updateOrderSchema.safeParse({
            status: 'delivered',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when you update order status with lowercase cancelled', () => {
        const result = updateOrderSchema.safeParse({
            status: 'cancelled',
        })
        expect(result.success).toBe(true);
    });
    it('should validate valid when you update order status with lowercase returned', () => {
        const result = updateOrderSchema.safeParse({
            status: 'returned',
        })
        expect(result.success).toBe(true);
    });
});

describe('Order Filter Schema Tests', () => {
    describe('Filtering Props tests', () => {
        it('should validate valid when filter doesn\'t include any filtering props', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: 'user.name',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when filter has only search query defined', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: 'test',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when filter has only status defined', () => {
            const result = OrderFilterSchema.safeParse({
                status: 'PENDING',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when only filtering dates are defined', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2022-01-01',
                endDate: '2022-01-02',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when only start date filtering is defined', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2022-01-01',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when only end date filtering is defined', () => {
            const result = OrderFilterSchema.safeParse({
                endDate: '2022-01-02',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when filter contains all the filtering properties togather', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: 'test',
                status: 'PENDING',
                startDate: '2022-01-01',
                endDate: '2022-01-02',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate invalid when you filter with start date greater then end date', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2022-01-02',
                endDate: '2022-01-01',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('End date cannot be before start date or equal to');
        });
        it('should validate valid when dates are far apart', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2022-01-01',
                endDate: '2022-01-03',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when filtering dates are in different years', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2022-01-01',
                endDate: '2023-01-02',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        })
        it('should validate valid when dates are in date formats', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        })
        it('should validate invalid when you filter with future dates', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2030-01-01',
                endDate: '2030-01-15',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Filter dates cannot be in the future (orders cannot be created for future dates)');
        });
        it('should validate valid when you filter with arabic search query text', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: 'البحث',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when you filter with english search query text', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: 'search',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when you filter with french search query text', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: 'réclamation, précommande',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when you search with numbers', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: '123',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate invalid when it faces xss injection in search field', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: '<script>alert("xss")</script>',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Search query can only contain letters (English, French, Arabic), numbers, spaces, and basic punctuation (hyphens, apostrophes, commas, periods, question marks, exclamation marks, colons, semicolons)');
        });
        it('should validate valid when filtering props are null', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: null,
                status: null,
                startDate: null,
                endDate: null,
                currentPage: 1,
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate valid when filtering props are undefiend', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: undefined,
                status: undefined,
                startDate: undefined,
                endDate: undefined,
                currentPage: 1,
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when filtering start date equals to end date', () => {
            const result = OrderFilterSchema.safeParse({
                startDate: '2022-01-01',
                endDate: '2022-01-01',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('End date cannot be before start date or equal to');
        });
    });
    describe('Sorting Props Tests', () => {
        it('should validate invalid when you filter with invalid sort by', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: 'user.email',
                sortDirection: 'desc',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, user.name, createdAt, status, total, items');
        });
        it('should validate valid when you filter with valid sort by', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: 'createdAt',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 5,
            })
            expect(result.success).toBe(true);
        });
        it('should validate valid when filtering with no sorting props defined', () => {
            const result = OrderFilterSchema.safeParse({
                searchQuery: 'something',
                status: 'PENDING',
                startDate: '2022-01-01',
                endDate: '2022-01-02',
                limit: 5,
                currentPage: 1,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when sorting props are null', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: null,
                sortDirection: null,
                currentPage: 1,
                limit: 5,
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].path).toEqual(['sortBy']);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, user.name, createdAt, status, total, items');
        });
        it('should validate valid when sorting props are undefined', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: undefined,
                sortDirection: undefined,
                currentPage: 1,
                limit: 5,
            });
            expect(result.success).toBe(true);
        });
        it('should validate invalid when you filter with invalid sort direction', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: 'createdAt',
                sortDirection: 'in between',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Sort direction should be one of asc or desc');
        });
        it('should validate invalid when filtering with sort by and no sort direction', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: 'createdAt',
                sortDirection: null,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Both sort by and sort direction must be provided together for sorting');
        });
        it('should validate invalid when filtering with sort direction and no sort by', () => {
            const result = OrderFilterSchema.safeParse({
                sortBy: null,
                sortDirection: 'asc',
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Sort by should be one of id, user.name, createdAt, status, total, items');
        });
    });
    describe('Pagination Props Tests', () => {
        it('should validate invalid when filtering without pagination props', () => {
            const result = OrderFilterSchema.safeParse({});
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Both current page and limit must be provided together when filtering or sorting');
        });
        it('should validate invalid when filtering with defined limit but without providing currentPage value', () => {
            const result = OrderFilterSchema.safeParse({
                limit: 5,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Both current page and limit must be provided together when filtering or sorting');
        });
        it('should validate invalid when filtering with provided currentPage but with no limit value', () => {
            const result = OrderFilterSchema.safeParse({
                currentPage: 1,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Both current page and limit must be provided together when filtering or sorting');
        });
        it('should validate invalid when filtering with too low current page value', () => {
            const result = OrderFilterSchema.safeParse({
                currentPage: 0,
                limit: 5,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe(`Current page must be greater than ${minCurrentPage}`);
        });
        it('should validate invalid when you filtering with too low limit value', () => {
            const result = OrderFilterSchema.safeParse({
                currentPage: 1,
                limit: 4,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe(`Limit should be greater than ${minLimit}`);
        })
        it('should validate invalid when you filtering with too high limit value', () => {
            const result = OrderFilterSchema.safeParse({
                currentPage: 1,
                limit: 21,
            })
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe(`Limit should be less than ${maxLimit}`);
        })
    })
})