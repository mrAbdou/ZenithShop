# Implementation Plan: Admin Panel Internationalization

## Overview

This implementation plan breaks down the admin panel internationalization feature into discrete, manageable tasks. Each task builds on previous work and focuses on specific components or sections of the admin panel. The approach is incremental, allowing for testing and validation at each step.

## Tasks

- [x] 1. Update locale files with admin translations
  - Add complete "admin" namespace to en.json with all English translations
  - Add complete "admin" namespace to fr.json with all French translations
  - Add complete "admin" namespace to ar.json with all Arabic translations
  - Preserve all existing translations in locale files
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Update dashboard page and components
  - [x] 2.1 Update dashboard page (app/control-panel/dashboard/page.js)
    - Import getDictionary and getLocale
    - Update generateMetadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.5_

  - [x] 2.2 Update DashboardMetrics component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Maintain all existing functionality and styling
    - _Requirements: 5.1, 5.2, 5.3, 7.1, 7.3_

- [x] 3. Update products management pages and components
  - [x] 3.1 Update products listing page (app/control-panel/products/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.6_

  - [x] 3.2 Update add product page (app/control-panel/products/add-product/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.6_

  - [x] 3.3 Update product details page (app/control-panel/products/[productId]/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.6_

  - [x] 3.4 Update edit product page (app/control-panel/products/[productId]/edit/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.6_

  - [x] 3.5 Update ProductsManagement component
    - Add useTranslation hook if needed
    - Replace any hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 3.6 Update ProductsTable component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update status labels (In Stock, Low Stock, Out of Stock)
    - Maintain all existing functionality
    - _Requirements: 5.1, 5.2, 5.5, 8.4_

  - [x] 3.7 Update ProductsFilters component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update placeholder text and labels
    - _Requirements: 5.1, 5.2, 5.6, 6.3_

  - [x] 3.8 Update AddProductForm component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update form labels, placeholders, and button text
    - Update validation error messages
    - _Requirements: 5.1, 5.2, 5.7, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 3.9 Update UpdateProductForm component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update form labels, placeholders, and button text
    - Update validation error messages
    - _Requirements: 5.1, 5.2, 5.8, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 3.10 Update ProductDeleteButton component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update confirmation dialog text
    - _Requirements: 5.1, 5.2_

  - [x] 3.11 Update ProductImageCarousel component
    - Add useTranslation hook if needed
    - Replace any hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2_

- [x] 4. Checkpoint - Test products section
  - Verify all products pages display correctly in all three languages
  - Test product CRUD operations work with translated UI
  - Ensure all tests pass, ask the user if questions arise

- [x] 5. Update categories management pages and components
  - [x] 5.1 Update categories listing page (app/control-panel/categories/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.7_

  - [x] 5.2 Update edit category page (app/control-panel/categories/[categoryId]/edit/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.7_

  - [x] 5.3 Update CategoriesManagement component
    - Add useTranslation hook if needed
    - Replace any hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2, 5.9_

  - [x] 5.4 Update CategoriesTable component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2, 5.10_

  - [x] 5.5 Update CategoriesFilters component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2_

  - [x] 5.6 Update AddCategoryForm component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update form labels, placeholders, and button text
    - Update validation error messages
    - _Requirements: 5.1, 5.2, 5.11, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.7 Update UpdateCategoryForm component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update form labels, placeholders, and button text
    - Update validation error messages
    - _Requirements: 5.1, 5.2, 5.12, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Checkpoint - Test categories section
  - Verify all categories pages display correctly in all three languages
  - Test category CRUD operations work with translated UI
  - Ensure all tests pass, ask the user if questions arise

- [x] 7. Update orders management pages and components
  - [x] 7.1 Update orders listing page (app/control-panel/orders/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.8_

  - [x] 7.2 Update order details page (app/control-panel/orders/[orderId]/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.8_

  - [x] 7.3 Update update order page (app/control-panel/orders/[orderId]/update/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.8_

  - [x] 7.4 Update OrdersManagement component
    - Add useTranslation hook if needed
    - Replace any hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2, 5.13_

  - [x] 7.5 Update OrdersTable component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update status labels (PENDING, COMPLETED, CANCELLED, etc.)
    - _Requirements: 5.1, 5.2, 5.14, 8.4_

  - [x] 7.6 Update OrdersFilters component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2_

  - [x] 7.7 Update UpdateOrderForm component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update form labels and button text
    - _Requirements: 5.1, 5.2, 5.15, 6.3, 6.4_

- [x] 8. Checkpoint - Test orders section
  - Verify all orders pages display correctly in all three languages
  - Test order update operations work with translated UI
  - Ensure all tests pass, ask the user if questions arise

- [x] 9. Update users management pages and components
  - [x] 9.1 Update users listing page (app/control-panel/users/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.9_

  - [x] 9.2 Update user details page (app/control-panel/users/[userId]/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3, 4.9_

  - [x] 9.3 Update UsersManagement component
    - Add useTranslation hook if needed
    - Replace any hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2, 5.16_

  - [x] 9.4 Update UsersTable component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - Update role labels (ADMIN, CUSTOMER)
    - _Requirements: 5.1, 5.2, 5.17, 8.5_

  - [x] 9.5 Update UsersFilters component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2_

- [x] 10. Checkpoint - Test users section
  - Verify all users pages display correctly in all three languages
  - Test user management operations work with translated UI
  - Ensure all tests pass, ask the user if questions arise

- [x] 11. Update control panel main page
  - [x] 11.1 Update control panel index page (app/control-panel/page.js)
    - Import getDictionary and getLocale
    - Update metadata to use translations
    - Replace all hard-coded strings with dictionary lookups
    - _Requirements: 4.1, 4.3_

- [x] 12. Update shared admin components
  - [x] 12.1 Update ControlPanelForm component
    - Add useTranslation hook
    - Replace all hard-coded strings with t() function calls
    - _Requirements: 5.1, 5.2_

  - [x] 12.2 Update ProductDetailsSkeleton component if it exists
    - Component verified - no text content requiring translation (loading skeleton only)
    - _Requirements: 5.1, 5.2_

- [x] 13. Final integration and testing
  - [x] 13.1 Verify no hard-coded strings remain
    - Search all admin pages for hard-coded English strings
    - Search all admin components for hard-coded English strings
    - _Requirements: 10.1, 10.2_

  - [x] 13.2 Test language switching
    - Test switching between en, fr, ar in admin panel
    - Verify all text updates correctly
    - Verify layout remains consistent
    - _Requirements: 10.3, 10.5_

  - [x] 13.3 Test fallback behavior
    - Test with missing translation keys
    - Verify keys display as fallback
    - Verify no errors are thrown
    - _Requirements: 10.4, 7.5_

  - [x] 13.4 Test dynamic content
    - Test parameter interpolation in translations
    - Test date formatting
    - Test currency formatting
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 14. Fix missing translation keys
  - Add missing translation keys to French and Arabic locale files
  - Keys needed: "maxImagesError", "removeExistingImage" in admin.products section
  - Ensure all locale files have consistent translation key structure
  - _Requirements: 3.2, 3.3, 9.1_

- [x] 15. Final checkpoint
  - Run full admin panel workflow in all three languages
  - Verify all CRUD operations work correctly
  - Verify all forms validate correctly
  - Verify all success/error messages display in correct language
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Each task builds on previous tasks incrementally
- Checkpoints ensure validation at key milestones
- All tasks reference specific requirements for traceability
- Focus is on systematic replacement of hard-coded strings with translation keys
- Existing functionality must be preserved throughout implementation

## Current Status Summary

**Completed Sections:**
- ✅ Locale files with admin translations
- ✅ Dashboard page and components
- ✅ Products management (all pages and components)
- ✅ Categories management (all pages and components)
- ✅ Orders management (all pages and components)
- ✅ Users management (all pages and components)
- ✅ Control panel main page
- ✅ Shared admin components
- ✅ Final integration and testing (comprehensive test suite created)

**In Progress:**
- 🔄 Task 14 - Fix missing translation keys

**Remaining Work:**
- ⏳ Fix missing translation keys in French and Arabic locale files (task 14)
- ⏳ Final checkpoint with all tests passing (task 15)
