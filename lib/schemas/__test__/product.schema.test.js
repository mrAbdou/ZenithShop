import { describe, it, expect } from "vitest";
import { AddProductSchema, InfiniteProductSchema, ProductPaginationSchema, UpdateProductSchema } from "../product.schema";
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
                expect(result.error.issues[0].message).toBe('Price must be a positive number');
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
                expect(result.error.issues[0].message).toBe('Qte in stock must be a positive number');
            });
            it('should validate invalid for a negative quantity in stock value', () => {
                const result = AddProductSchema.safeParse({
                    name: 'Product 1',
                    description: 'Description of product 1',
                    price: 99.99,
                    qteInStock: -1,
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Qte in stock must be a positive number');
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
    it('should validate valid for empty filter', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for empty filter with empty string dates', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: '',
            endDate: '',
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid for string dates', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when stock takes In Stock value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: 'In Stock',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when stock takes Low Stock value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: 'Low Stock',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when stock takes Out Stock value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: 'Out Stock',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when stock takes empty string value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when stock takes wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: 'wrong stock value',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"In Stock"|"Low Stock"|"Out Stock"')
    });
    it('should validate invalid when endDate takes value before startDate value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: '2022-01-01',
            endDate: '2021-12-31',
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input') // Zod's default refine message
    });
    it('should validate valid for filter without searchQuery', () => {
        const result = ProductPaginationSchema.safeParse({
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid when filter without stock', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid when filter without startDate', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid when filter without endDate', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when filter without sorting props', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when filter without pagination props', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when sortBy takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: 'wrong sortBy value',
            sortDirection: null,
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"id"|"name"|"price"|"stock"|"createdAt"')
    });
    it('should validate invalid when sortDirection takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: 'wrong sortDirection value',
            limit: 5,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid option: expected one of ""|"asc"|"desc"')
    });
    it('should validate invalid when limit takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 100,
            currentPage: 1
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Too big: expected number to be <=50')
    });
    it('should validate invalid when currentPage takes a wrong value', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
            sortBy: null,
            sortDirection: null,
            limit: 5,
            currentPage: 0
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Too small: expected number to be >=1')
    });
    it('should validate valid when filters has only contains sorting props', () => {
        const result = ProductPaginationSchema.safeParse({
            sortBy: 'name',
            sortDirection: 'asc',
        })
        expect(result.success).toBe(true)
    })
    it('should validate valid when filters has only pagination props', () => {
        const result = ProductPaginationSchema.safeParse({
            limit: 5,
            currentPage: 1,
        })
        expect(result.success).toBe(true)
    });
    it('should validate valid when filters has only filtering props', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when filters has wrong date formats', () => {
        const result = ProductPaginationSchema.safeParse({
            searchQuery: '',
            stock: '',
            startDate: '12/21',
            endDate: '01/22',
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input') // Zod's default refine message
    });
    it('should validate valid when filters is empty', () => {
        const result = ProductPaginationSchema.safeParse({})
        expect(result.success).toBe(true)
    })
})

describe('Infinite Product Schema Test', () => {
    it('should validate valid when infinite scroll at start position', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0,
        })
        expect(result.success).toBe(true)
    });
    it('should validate invalid when infinite scroll has too small offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: -1,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Too small: expected number to be >=0')
    });
    it('should validate invalid when infinite scroll has too big limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 100,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Too big: expected number to be <=50')
    });
    it('should validate invalid when infinite scroll has too small limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 0,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Too small: expected number to be >=5')
    });
    it('should validate invalid when infinite scroll has non integer limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5.5,
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input: expected int, received number')
    });
    it('should validate invalid when infinite scroll has non integer offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: 0.5,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input: expected int, received number')
    });
    it('should validate invalid when infinite scroll has string value limit', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: '5',
            offset: 0,
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input: expected number, received string')
    });
    it('should validate invalid when infinite scroll has string value offset', () => {
        const result = InfiniteProductSchema.safeParse({
            limit: 5,
            offset: '5',
        })
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input: expected number, received string')
    });
    it('should validate valid when infinite scroll has no props', () => {
        const result = InfiniteProductSchema.safeParse({})
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('Invalid input: expected number, received undefined');
    });
});
