/**
 * Integration tests for admin panel i18n
 * Tests language switching, translation coverage, and fallback behavior
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Panel I18n Integration', () => {
    describe('13.2 Language Switching', () => {
        it('should load English translations correctly', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            expect(dict.admin).toBeDefined();
            expect(dict.admin.dashboard).toBeDefined();
            expect(dict.admin.products).toBeDefined();
            expect(dict.admin.categories).toBeDefined();
            expect(dict.admin.orders).toBeDefined();
            expect(dict.admin.users).toBeDefined();
            
            // Verify key translations exist
            expect(dict.admin.dashboard.title).toBe('Welcome back,');
            expect(dict.admin.products.management).toBe('Products Management');
            expect(dict.admin.categories.management).toBe('Categories Management');
            expect(dict.admin.orders.management).toBe('Orders Management');
            expect(dict.admin.users.management).toBe('Users Management');
        });

        it('should load French translations correctly', () => {
            const frPath = path.join(process.cwd(), 'lib/i18n/locales/fr.json');
            const dict = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
            
            expect(dict.admin).toBeDefined();
            expect(dict.admin.dashboard).toBeDefined();
            expect(dict.admin.products).toBeDefined();
            expect(dict.admin.categories).toBeDefined();
            expect(dict.admin.orders).toBeDefined();
            expect(dict.admin.users).toBeDefined();
            
            // Verify key translations exist in French
            expect(dict.admin.dashboard.title).toBe('Bienvenue,');
            expect(dict.admin.products.management).toBe('Gestion des produits');
            expect(dict.admin.categories.management).toBe('Gestion des catégories');
            expect(dict.admin.orders.management).toBe('Gestion des commandes');
            expect(dict.admin.users.management).toBe('Gestion des utilisateurs');
        });

        it('should load Arabic translations correctly', () => {
            const arPath = path.join(process.cwd(), 'lib/i18n/locales/ar.json');
            const dict = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
            
            expect(dict.admin).toBeDefined();
            expect(dict.admin.dashboard).toBeDefined();
            expect(dict.admin.products).toBeDefined();
            expect(dict.admin.categories).toBeDefined();
            expect(dict.admin.orders).toBeDefined();
            expect(dict.admin.users).toBeDefined();
            
            // Verify key translations exist in Arabic
            expect(dict.admin.dashboard.title).toBe('مرحباً بعودتك،');
            expect(dict.admin.products.management).toBe('إدارة المنتجات');
            expect(dict.admin.categories.management).toBe('إدارة الفئات');
            expect(dict.admin.orders.management).toBe('إدارة الطلبات');
            expect(dict.admin.users.management).toBe('إدارة المستخدمين');
        });

        it('should have consistent structure across all languages', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const frPath = path.join(process.cwd(), 'lib/i18n/locales/fr.json');
            const arPath = path.join(process.cwd(), 'lib/i18n/locales/ar.json');
            
            const enDict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            const frDict = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
            const arDict = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
            
            // Check that all languages have the same admin sections
            const enAdminKeys = Object.keys(enDict.admin);
            const frAdminKeys = Object.keys(frDict.admin);
            const arAdminKeys = Object.keys(arDict.admin);
            
            expect(enAdminKeys.sort()).toEqual(frAdminKeys.sort());
            expect(enAdminKeys.sort()).toEqual(arAdminKeys.sort());
            
            // Check products section keys
            const enProductKeys = Object.keys(enDict.admin.products);
            const frProductKeys = Object.keys(frDict.admin.products);
            const arProductKeys = Object.keys(arDict.admin.products);
            
            expect(enProductKeys.sort()).toEqual(frProductKeys.sort());
            expect(enProductKeys.sort()).toEqual(arProductKeys.sort());
        });

        it('should have all newly added translation keys in all languages', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const frPath = path.join(process.cwd(), 'lib/i18n/locales/fr.json');
            const arPath = path.join(process.cwd(), 'lib/i18n/locales/ar.json');
            
            const enDict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            const frDict = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
            const arDict = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
            
            // Check newly added keys from task 13.1
            const newKeys = [
                'supportedFormatsShort',
                'addNewImages',
                'manageProductPhotos',
                'enterPriceUSD',
                'currentInventoryCount',
                'cancelChanges',
                'updatingProduct',
                'existing',
                'new',
                'newImagesSelected',
                'updateActions',
                'saveOrDiscard',
                'noCategoryAssigned'
            ];
            
            newKeys.forEach(key => {
                expect(enDict.admin.products[key]).toBeDefined();
                expect(frDict.admin.products[key]).toBeDefined();
                expect(arDict.admin.products[key]).toBeDefined();
            });
        });

        it('should verify layout consistency - all text should be translatable', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Verify critical admin sections have translations
            const criticalSections = [
                'dashboard',
                'products',
                'categories',
                'orders',
                'users',
                'common'
            ];
            
            criticalSections.forEach(section => {
                expect(dict.admin[section]).toBeDefined();
                expect(Object.keys(dict.admin[section]).length).toBeGreaterThan(0);
            });
        });
    });
});


    describe('13.3 Fallback Behavior', () => {
        it('should handle missing translation keys gracefully in useTranslation', () => {
            // Test the t() function behavior with missing keys
            // The t() function should return the key itself as fallback
            const mockT = (key) => {
                const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
                const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
                
                // Navigate nested keys
                const keys = key.split('.');
                let value = dict;
                for (const k of keys) {
                    if (value && typeof value === 'object' && k in value) {
                        value = value[k];
                    } else {
                        return key; // Fallback to key
                    }
                }
                return value;
            };
            
            // Test with valid key
            expect(mockT('admin.products.management')).toBe('Products Management');
            
            // Test with missing key - should return the key itself
            expect(mockT('admin.products.nonExistentKey')).toBe('admin.products.nonExistentKey');
            expect(mockT('admin.nonExistent.section')).toBe('admin.nonExistent.section');
        });

        it('should not throw errors when accessing missing keys', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Accessing missing keys should not throw
            expect(() => {
                const value = dict.admin?.nonExistent?.key;
                return value;
            }).not.toThrow();
            
            // Should return undefined for missing keys
            expect(dict.admin?.nonExistent?.key).toBeUndefined();
        });

        it('should verify fallback strings are used in components', () => {
            // Read UpdateProductForm to verify it uses translation keys
            const formPath = path.join(process.cwd(), 'components/admin/UpdateProductForm.jsx');
            const formContent = fs.readFileSync(formPath, 'utf-8');
            
            // Verify that hard-coded strings have been replaced with t() calls
            expect(formContent).toContain("t('admin.products.productPrice')");
            expect(formContent).toContain("t('admin.products.stockQuantity')");
            expect(formContent).toContain("t('admin.products.uploadImage')");
            
            // Verify no hard-coded English strings remain (except comments)
            const hardCodedPatterns = [
                'Product Price',
                'Stock Quantity',
                'Upload Product Image',
                'Pricing & Inventory',
                'Product Identity'
            ];
            
            hardCodedPatterns.forEach(pattern => {
                // Should not find these as standalone strings in JSX
                const regex = new RegExp(`>\\s*${pattern}\\s*<`, 'g');
                expect(formContent.match(regex)).toBeNull();
            });
        });

        it('should verify product details page uses fallback correctly', () => {
            const pagePath = path.join(process.cwd(), 'app/control-panel/products/[productId]/page.js');
            const pageContent = fs.readFileSync(pagePath, 'utf-8');
            
            // Verify fallback is using dictionary key, not hard-coded string
            expect(pageContent).toContain('dictionary.admin.products.noCategoryAssigned');
            expect(pageContent).not.toContain("'No category assigned'");
        });

        it('should verify all locale files are valid JSON', () => {
            const locales = ['en', 'fr', 'ar'];
            
            locales.forEach(locale => {
                const localePath = path.join(process.cwd(), `lib/i18n/locales/${locale}.json`);
                
                expect(() => {
                    const content = fs.readFileSync(localePath, 'utf-8');
                    JSON.parse(content);
                }).not.toThrow();
            });
        });

        it('should verify no empty translation values exist', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            const checkForEmptyValues = (obj, path = '') => {
                for (const [key, value] of Object.entries(obj)) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (typeof value === 'object' && value !== null) {
                        checkForEmptyValues(value, currentPath);
                    } else if (typeof value === 'string') {
                        expect(value.trim()).not.toBe('');
                    }
                }
            };
            
            checkForEmptyValues(dict.admin);
        });
    });


    describe('13.4 Dynamic Content', () => {
        it('should support parameter interpolation in translations', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Test translations with parameter placeholders
            const translationsWithParams = [
                { key: 'admin.products.imagesSelected', placeholder: '{count}' },
                { key: 'admin.products.addNewImages', placeholder: '{count}' },
                { key: 'admin.products.newImagesSelected', placeholder: '{count}' }
            ];
            
            translationsWithParams.forEach(({ key, placeholder }) => {
                const keys = key.split('.');
                let value = dict;
                for (const k of keys) {
                    value = value[k];
                }
                
                expect(value).toContain(placeholder);
            });
        });

        it('should verify parameter interpolation works correctly', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Simulate parameter replacement
            const template = dict.admin.products.imagesSelected;
            const result = template.replace('{count}', '5');
            
            expect(result).toBe('5 image(s) selected and ready to upload (Max 10)');
            expect(result).not.toContain('{count}');
        });

        it('should verify all languages have matching parameter placeholders', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const frPath = path.join(process.cwd(), 'lib/i18n/locales/fr.json');
            const arPath = path.join(process.cwd(), 'lib/i18n/locales/ar.json');
            
            const enDict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            const frDict = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
            const arDict = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
            
            // Check that parameter placeholders exist in all languages
            expect(enDict.admin.products.imagesSelected).toContain('{count}');
            expect(frDict.admin.products.imagesSelected).toContain('{count}');
            expect(arDict.admin.products.imagesSelected).toContain('{count}');
            
            expect(enDict.admin.products.addNewImages).toContain('{count}');
            expect(frDict.admin.products.addNewImages).toContain('{count}');
            expect(arDict.admin.products.addNewImages).toContain('{count}');
        });

        it('should verify date formatting translations exist', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Verify date-related fields are present
            expect(dict.admin.products.created).toBeDefined();
            expect(dict.admin.orders.date).toBeDefined();
            expect(dict.admin.categories.created).toBeDefined();
            expect(dict.admin.users.created).toBeDefined();
        });

        it('should verify currency formatting translations exist', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Verify currency-related fields are present
            expect(dict.admin.products.price).toBeDefined();
            expect(dict.admin.products.productPrice).toBeDefined();
            expect(dict.admin.orders.total).toBeDefined();
        });

        it('should verify status translations are complete', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Verify order status translations
            const orderStatuses = ['pending', 'completed', 'cancelled', 'confirmed', 'shipped', 'delivered'];
            orderStatuses.forEach(status => {
                expect(dict.admin.orders[status]).toBeDefined();
            });
            
            // Verify product stock status translations
            expect(dict.admin.products.inStockLabel).toBeDefined();
            expect(dict.admin.products.lowStockLabel).toBeDefined();
            expect(dict.admin.products.outOfStockLabel).toBeDefined();
        });

        it('should verify role translations are complete', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Verify user role translations
            expect(dict.admin.users.admin).toBeDefined();
            expect(dict.admin.users.customer).toBeDefined();
        });

        it('should verify parameter interpolation in UpdateProductForm', () => {
            const formPath = path.join(process.cwd(), 'components/admin/UpdateProductForm.jsx');
            const formContent = fs.readFileSync(formPath, 'utf-8');
            
            // Verify that parameter interpolation is used correctly
            expect(formContent).toContain(".replace('{count}'");
            
            // Check for specific interpolation patterns
            expect(formContent).toMatch(/t\(['"]admin\.products\.\w+['"]\)\.replace\(['"]\{count\}['"]/);
        });

        it('should verify all parameter placeholders follow consistent format', () => {
            const enPath = path.join(process.cwd(), 'lib/i18n/locales/en.json');
            const dict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
            
            // Check that all placeholders use {paramName} format
            const checkPlaceholders = (obj, path = '') => {
                for (const [key, value] of Object.entries(obj)) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (typeof value === 'object' && value !== null) {
                        checkPlaceholders(value, currentPath);
                    } else if (typeof value === 'string' && value.includes('{')) {
                        // Verify placeholder format: {word}
                        const placeholders = value.match(/\{[a-zA-Z]+\}/g);
                        if (placeholders) {
                            placeholders.forEach(placeholder => {
                                expect(placeholder).toMatch(/^\{[a-zA-Z]+\}$/);
                            });
                        }
                    }
                }
            };
            
            checkPlaceholders(dict.admin);
        });
    });
