import { describe, it, expect } from "vitest";
import { AddProductSchema, InfiniteProductSchema, ProductPaginationSchema, UpdateProductSchema } from "../product.schema";
import { maxLimit } from "@/lib/constants";
describe('Create Product Schema Test', () => {
    describe('Required fields', () => {
        describe('Name filed', () => {
            it('should validate invalid to create product with missing name', () => {
                const result = AddProductSchema.safeParse({
                    description: 'Description of a product that doesn\'t have a name',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Name is required as string');
            });
            it('should validate invalid to create product with too short name', () => {
                const result = AddProductSchema.safeParse({
                    name: 'P',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Product name must be at least 3 characters');
            });
            it('should validate invalid to create product with too long name', () => {
                const result = AddProductSchema.safeParse({
                    name: 'P'.repeat(256),
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Product name must be less than 255 characters');
            });
            it('should validate invalid to create product with wrong name value type', () => {
                const result = AddProductSchema.safeParse({
                    name: 123,
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Name is required as string');
            });
            it('should validate valid to create product with string name value that has numbers inside', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate invalid to create product with string name value that has special characters inside', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product!@# 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Product name contains invalid characters');
            });
            it('should validate valid to create product with string name value that has spaces', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1 that should be valid',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for arabic product names', () => {
                const result = AddProductSchema.safeParse({
                    name: 'منتج 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for french product names', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Produit génial rouge à lèvre 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            })
        });
        describe('Price field', () => {
            it('should validate invalid to create product with missing price', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Price is required as number');
            });
            it('should validate valid to create product with decimal price', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate invalid to create product with wrong price value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: -1,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Price must be greater than 0');
            });
            it('should validate invalid to create product with zero price', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 0,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Price must be greater than 0');
            });
            it('should validate valid to create product with numbers as string value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: '123',
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid to create product with string value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 'hundred twanty three',
                    qteInStock: '10',
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Price is required as number');
            });

        });
        describe('Quantity In Stock field', () => {
            it('should validate valid to create product with string quantity in stock value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: '10',
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid to create product with decimal quantity in stock value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: 10.5,
                });
                expect(result.success).toBe(true);
            });
            it('should validate invalid to create product with missing quantity in stock', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Quantity in stock is required');
            });
            it('should validate invalid to create product with wrong quantity in stock value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: -1,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Quantity in stock must be at least 1');
            });
            it('should validate invalid for a negative quantity in stock value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: -1,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Quantity in stock must be at least 1');
            });
            it('should validate invalid for zero quantity in stock value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: 0,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Quantity in stock must be at least 1');
            });
        })
    });
    describe('Optional fields', () => {
        describe('Description field', () => {
            it('should validate valid for full product object with provided description', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for full product object without provided description', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for product description in arabic', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'وصف المنتج 1',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for product description in french', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'rouge à lèvre génial pour les femmes arabes à prix abordable',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(true);
            });
            it('should validate invalid for too long product description', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'product description is too long'.repeat(650),
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Description must be less than 2000 characters');
            })
            it('should validate valid for product description that contains special characters', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'product description contains special characters !@#$%^&*()_+{}|:"<>?/',
                    price: 99.99,
                    qteInStock: 10,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Product Description contains invalid characters');
            });
        })
    });
});

describe('Update Product Schema test', () => {
    describe('Optional Fields', () => {
        describe('Name field', () => {
            it('should validate valid to update only name', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'updated product name'
                })
                expect(result.success).toBe(true)
            });
            it('should validate invalid to update name with wrong value type', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 123
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Name should be a string')
            });
            it('should validate invalid to update name with too short value', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'P'
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Product name must be at least 3 characters')
            });
            it('should validate invalid to update name with empty string value', () => {
                const result = UpdateProductSchema.safeParse({
                    name: ''
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Product name must be at least 3 characters')
            });
            it('should validate invalid to update name with too long value', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'P'.repeat(256)
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Product name must be less than 255 characters')
            });
            it('should validate valid for updating name with string value that has numbers', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'product01'
                })
                expect(result.success).toBe(true)
            });
            it('should validate invalid for updating name with string value that has special characters', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'product@01'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Product name contains invalid characters')
            });
            it('should validate valid for updating name with string that has spaces', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'product 01'
                })
                expect(result.success).toBe(true)
            });
            it('should validate valid for updating name with arabic text', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'منتج'
                })
                expect(result.success).toBe(true)
            });
            it('should validate valid for updating name with french text', () => {
                const result = UpdateProductSchema.safeParse({
                    name: 'rouge à lèvres géniaux'
                })
                expect(result.success).toBe(true)
            });
        });
        describe('Description Field', () => {
            it('should validate valid to update only description', () => {
                const result = UpdateProductSchema.safeParse({
                    description: 'updated product description'
                })
                expect(result.success).toBe(true)
            });
            it('should validate valid to update description with string text that has numbers', () => {
                const result = UpdateProductSchema.safeParse({
                    description: 'updatedProductDescription01'
                })
                expect(result.success).toBe(true)
            });
            it('should validate invalid to update description with string text that has special characters', () => {
                const result = UpdateProductSchema.safeParse({
                    description: 'updatedProductDescription@01'
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Product description contains invalid characters')
            });
            it('should validate valid to update description with string text that has spaces', () => {
                const result = UpdateProductSchema.safeParse({
                    description: 'updatedProductDescription 01'
                })
                expect(result.success).toBe(true)
            });
            it('should validate invalid for update description with too long text', () => {
                const result = UpdateProductSchema.safeParse({
                    description: 'updatedProductDescription'.repeat(900)
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Description must be less than 2000 characters')
            })
        });
        describe('Price Field', () => {
            it('should validate valid to update only price', () => {
                const result = UpdateProductSchema.safeParse({
                    price: 99.99
                })
                expect(result.success).toBe(true)
            });
            it('should validate valid to update price with string value', () => {
                const result = UpdateProductSchema.safeParse({
                    price: '123'
                })
                expect(result.success).toBe(true)
            });
            it('should validate invalid to update price with string alphabetic value', () => {
                const result = UpdateProductSchema.safeParse({
                    price: 'abc'
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Price should be a number')
            });
            it('should validate invalid to update price with negative value', () => {
                const result = UpdateProductSchema.safeParse({
                    price: -123
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Price must be a positive number')
            });
            it('should validate invalid to update price with string special characters value', () => {
                const result = UpdateProductSchema.safeParse({
                    price: 'abc@123'
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Price should be a number')
            });

        });
        describe('Quantity In Stock Field', () => {
            it('should validate valid for only quantity in stock to be updated', () => {
                const result = UpdateProductSchema.safeParse({
                    qteInStock: 10
                })
                expect(result.success).toBe(true)
            });
            it('should validate valid to update quantity in stock with string numeric value', () => {
                const result = UpdateProductSchema.safeParse({
                    qteInStock: '123'
                })
                expect(result.success).toBe(true)
            });
            it('should validate invalid to update quantity in stock with negative value', () => {
                const result = UpdateProductSchema.safeParse({
                    qteInStock: -1
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Quantity in stock must be a positive number')
            });
            it('should validate invalid to update quantity in stock with alphabetic string text', () => {
                const result = UpdateProductSchema.safeParse({
                    qteInStock: 'three hundred',
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Quantity in stock should be a number')
            });
            it('should validate invalid to update quantity in stock with special characters string text', () => {
                const result = UpdateProductSchema.safeParse({
                    qteInStock: 'three hundred $',
                })
                expect(result.success).toBe(false)
                expect(result.error.issues[0].message).toBe('Quantity in stock should be a number')
            });

        });

    });
});

describe('Product Filter Schema Test', () => {
    it('should validate invalid for empty filter', () => {
        const result = ProductPaginationSchema.safeParse({})
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(2);
        expect(result.error.issues[0].message).toBe('Limit should be a number');
        expect(result.error.issues[1].message).toBe('Current page should be a number');
    });
    it('should validate valid for filter with empty string dates', () => {
        const result = ProductPaginationSchema.safeParse({
            startDate: '',
            endDate: '',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for filter with string dates', () => {
        const result = ProductPaginationSchema.safeParse({
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for filter with stock takes In Stock value', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: 'In Stock',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for filter with stock takes Low Stock value', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: 'Low Stock',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for filter with stock takes Out Stock value', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: 'Out Stock',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for filter with stock takes empty string value', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: '',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid for filter with stock takes wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: 'wrong stock value',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"In Stock"|"Low Stock"|"Out Stock"')
    });
    it('should validate invalid for filter with endDate takes value before startDate value', () => {
        const result = ProductPaginationSchema.safeParse({
            startDate: '2022-01-01',
            endDate: '2021-12-31',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid date range') // Zod's default refine message
    });
    it('should validate valid for filter without searchQuery', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: '',
            startDate: new Date(),
            endDate: new Date('04/01/2026'),
            sortBy: 'createdAt',
            sortDirection: 'asc',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid for filter without stock', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Product',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid for filter without startDate', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Product',
            stock: 'Out Stock',
            endDate: '2022-12-31',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid for filter without endDate', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Product',
            stock: 'Out Stock',
            startDate: '2022-01-01',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for filter without sorting props', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Produit test',
            stock: 'Low Stock',
            startDate: null,
            endDate: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid for filter without pagination props', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'searchQuery',
            stock: 'Low Stock',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(2);
        expect(result.error.issues[0].message).toBe('Limit should be a number');
        expect(result.error.issues[1].message).toBe('Current page should be a number');
    });
    it('should validate invalid for filter when sortBy takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            sortBy: 'wrong sortBy value',
            sortDirection: 'desc',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"id"|"name"|"price"|"stock"|"createdAt"')
    });
    it('should validate invalid for filter with sortDirection takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            sortBy: 'price',
            sortDirection: 'wrong sortDirection value',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"asc"|"desc"')
    });
    it('should validate invalid for filter with limit takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'منتج',
            stock: 'In Stock',
            startDate: new Date(),
            endDate: new Date('04/01/2026'),
            sortBy: 'createdAt',
            sortDirection: 'asc',
            limit: 21,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe(`Limit should be at most ${maxLimit}`)
    });
    it('should validate invalid for filter with currentPage takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            limit: 5,
            currentPage: 0
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Current page should be at least 1')
    });
    it('should validate invalid for filter with filters has only sorting props', () => {
        const result = ProductPaginationSchema.safeParse({
            sortBy: 'name',
            sortDirection: 'asc',
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Limit should be a number');
        expect(result.error.issues[1].message).toBe('Current page should be a number');
    })
    it('should validate valid for filter with filters has only pagination props', () => {
        const result = ProductPaginationSchema.safeParse({
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid for filter with filters has only filtering props', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Product 01',
            stock: 'Out Stock',
            startDate: null,
            endDate: null,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(2);
        expect(result.error.issues[0].message).toBe('Limit should be a number');
        expect(result.error.issues[1].message).toBe('Current page should be a number');
    });
    it('should validate invalid for filter with filters has wrong date formats', () => {
        const result = ProductPaginationSchema.safeParse({
            startDate: '12/21',
            endDate: '01/22',
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid date range');
    });
    it('should validate invalid for filter with filters is empty', () => {
        const result = ProductPaginationSchema.safeParse({});
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Limit should be a number');
        expect(result.error.issues[1].message).toBe('Current page should be a number');
    });
    it('should validate invalid for filter with sorting with only sortBy provided', () => {
        const result = ProductPaginationSchema.safeParse({
            limit: 5,
            currentPage: 1,
            sortBy: 'name',
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Sort by and sort direction should be provided together');
    });
    it('should validate invalid for filter with sorting with only sortDirection provided', () => {
        const result = ProductPaginationSchema.safeParse({
            limit: 5,
            currentPage: 1,
            sortDirection: 'asc',
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Sort by and sort direction should be provided together');
    });
    it('should validate invalid for filter with filter object misses the current page information', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Produit 1',
            limit: 5,
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Current page should be a number');
    });
    it('should validate invalid for filter with filter object misses the limit information', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: 'Produit 1',
            currentPage: 1,
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Limit should be a number');
    });
});

describe('Infinite Product Schema Test', () => {
    it('should validate valid for infinite scroll at start position', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid for infinite scroll with too small offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: -1,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Offset should be at least 0')
    });
    it('should validate invalid for infinite scroll with too big limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 100,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be at most 20')
    });
    it('should validate invalid for infinite scroll with too small limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 0,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be at least 5')
    });
    it('should validate invalid when infinite scroll has decimal limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5.5,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be an integer')
    });
    it('should validate invalid when infinite scroll has decimal offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0.5,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Offset should be an integer')
    });
    it('should validate valid when infinite scroll has string numeric value limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: '5',
            offset: 0,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has string numeric value offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: '5',
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has no props', () => {
        const result = InfiniteProductSchema.safeParse({})
        expect(result.error.issues[0].message).toBe('Limit should be a number');
        expect(result.error.issues[1].message).toBe('Offset should be a number');
    });
    it('should validate valid when infinite scroll has string non numeric value limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 'a',
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be a number')
    });
    it('should validate valid when infinite scroll has string non numeric value offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 'a',
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Offset should be a number')
    });
    it('should validate valid when infinite scroll has string non numeric value limit and offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 'a',
            offset: 'a',
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be a number')
        expect(result.error.issues[1].message).toBe('Offset should be a number')
    });
    it('should validate valid when infinite scroll has string numeric limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: '5',
            offset: 0,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has string numeric offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: '5',
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has string numeric limit and offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: '5',
            offset: '5',
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when infinite scroll has decimal limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5.5,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be an integer')
    })
    it('should validate invalid when infinite scroll has decimal offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0.5,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Offset should be an integer')
    });
    it('should validate invalid when infinite scroll has decimal limit and offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5.5,
            offset: 0.5,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Limit should be an integer')
        expect(result.error.issues[1].message).toBe('Offset should be an integer')
    });
    it('should validate valid when infinite scroll has search filter in english', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            searchQuery: 'english',
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has search filter in arabic', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            searchQuery: 'منتج',
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has search filter in french', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            searchQuery: 'séjour',
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has search filter using numbers', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            searchQuery: '123',
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when infinite scroll has stock filter using special characters', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            searchQuery: '!@#',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Search query contains invalid characters')
    });
    it('should validate valid when infinite scroll has correct stock filter value', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            stock: 'In Stock',
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when infinite scroll has incorrect stock filter value', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            stock: 'In_Stock',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"In Stock"|"Low Stock"|"Out Stock"')
    });
    it('should validate valid when infinite scroll has correct min price filter value', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            minPrice: 10,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has correct max price filter value', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            maxPrice: 10,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when infinite scroll has incorrect min price filter value', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            minPrice: 'a',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Min price should be a number')
    });
    it('should validate invalid whrn infinite scroll has incorrect max price filter value', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            maxPrice: 'a',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Max price should be a number')
    })
    it('should validate valid when infinite scroll has both correct min and max prices ', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            minPrice: 10,
            maxPrice: 20,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when infinite scroll has both correct min and max prices with string numeric values', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            minPrice: '10',
            maxPrice: '20',
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when infinite scroll has borh incorrect min and max prices', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
            minPrice: 'a',
            maxPrice: 'b',
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Min price should be a number')
        expect(result.error.issues[1].message).toBe('Max price should be a number')
    });
    it('should validate invalid for infinite scroll with negative limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: -5,
            offset: 0,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Limit should be at least 5')
    });
    it('should validate invalid for infinite scroll with negative offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: -5,
        })
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('Offset should be at least 0')
    });
});
