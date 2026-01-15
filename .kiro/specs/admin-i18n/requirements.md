# Requirements Document

## Introduction

This specification defines the requirements for internationalizing (i18n) the admin control panel of the ZenithShop e-commerce application. The application already has an i18n system in place for the customer-facing side, supporting English (en), French (fr), and Arabic (ar). This feature will extend i18n support to all admin pages and components, ensuring administrators can use the control panel in their preferred language.

## Glossary

- **Admin_Control_Panel**: The administrative interface located at `/app/control-panel` used by administrators to manage products, categories, orders, and users
- **I18n_System**: The internationalization system using React Context (`I18nProvider`, `useTranslation`) and JSON locale files
- **Static_Text**: Hard-coded text strings in components that need to be replaced with translation keys
- **Translation_Key**: A dot-notation string (e.g., "admin.products.addProduct") used to retrieve translated text from locale files
- **Locale_File**: JSON files containing translations for each supported language (en.json, fr.json, ar.json)
- **Admin_Component**: React components in `/components/admin` used exclusively by the admin control panel

## Requirements

### Requirement 1: Identify All Admin Static Text

**User Story:** As a developer, I want to identify all static text in admin pages and components, so that I can systematically replace them with translation keys.

#### Acceptance Criteria

1. WHEN analyzing admin pages, THE System SHALL identify all hard-coded text strings in `/app/control-panel` directory
2. WHEN analyzing admin components, THE System SHALL identify all hard-coded text strings in `/components/admin` directory
3. WHEN identifying static text, THE System SHALL exclude dynamic content, variable values, and API responses
4. WHEN documenting static text, THE System SHALL record the file path, component name, and original text string

### Requirement 2: Define Translation Keys Structure

**User Story:** As a developer, I want a consistent translation key naming structure, so that translations are organized and easy to maintain.

#### Acceptance Criteria

1. THE Translation_Key_Structure SHALL follow the pattern "admin.{section}.{subsection}.{key}"
2. WHEN defining keys for dashboard, THE System SHALL use prefix "admin.dashboard"
3. WHEN defining keys for products management, THE System SHALL use prefix "admin.products"
4. WHEN defining keys for categories management, THE System SHALL use prefix "admin.categories"
5. WHEN defining keys for orders management, THE System SHALL use prefix "admin.orders"
6. WHEN defining keys for users management, THE System SHALL use prefix "admin.users"
7. WHEN defining keys for forms, THE System SHALL use prefix "admin.forms"
8. WHEN defining keys for common admin elements, THE System SHALL use prefix "admin.common"

### Requirement 3: Update Locale Files with Admin Translations

**User Story:** As a developer, I want to add admin translations to all locale files, so that the admin panel supports all configured languages.

#### Acceptance Criteria

1. WHEN adding translations, THE System SHALL update `/lib/i18n/locales/en.json` with English admin translations
2. WHEN adding translations, THE System SHALL update `/lib/i18n/locales/fr.json` with French admin translations
3. WHEN adding translations, THE System SHALL update `/lib/i18n/locales/ar.json` with Arabic admin translations
4. WHEN structuring translations, THE System SHALL create an "admin" top-level key in each locale file
5. WHEN adding new translations, THE System SHALL preserve existing translations in locale files
6. WHEN translations are missing, THE System SHALL fall back to the translation key as display text

### Requirement 4: Update Admin Page Components

**User Story:** As an administrator, I want all admin pages to display text in my selected language, so that I can use the control panel in my preferred language.

#### Acceptance Criteria

1. WHEN rendering admin pages, THE System SHALL use the `useTranslation` hook to access translations
2. WHEN displaying static text, THE System SHALL replace hard-coded strings with translation function calls
3. WHEN a page is server-rendered, THE System SHALL use `getDictionary` to fetch translations server-side
4. WHEN a page is client-rendered, THE System SHALL use `useTranslation` hook to access translations
5. THE System SHALL update all pages in `/app/control-panel/dashboard`
6. THE System SHALL update all pages in `/app/control-panel/products`
7. THE System SHALL update all pages in `/app/control-panel/categories`
8. THE System SHALL update all pages in `/app/control-panel/orders`
9. THE System SHALL update all pages in `/app/control-panel/users`

### Requirement 5: Update Admin Component Files

**User Story:** As an administrator, I want all admin components to display text in my selected language, so that the entire admin interface is consistent.

#### Acceptance Criteria

1. WHEN rendering admin components, THE System SHALL use the `useTranslation` hook to access translations
2. WHEN displaying static text in components, THE System SHALL replace hard-coded strings with translation function calls
3. THE System SHALL update `DashboardMetrics.jsx` with translation keys
4. THE System SHALL update `ProductsManagement.jsx` and related components with translation keys
5. THE System SHALL update `ProductsTable.jsx` with translation keys
6. THE System SHALL update `ProductsFilters.jsx` with translation keys
7. THE System SHALL update `AddProductForm.jsx` with translation keys
8. THE System SHALL update `UpdateProductForm.jsx` with translation keys
9. THE System SHALL update `CategoriesManagement.jsx` and related components with translation keys
10. THE System SHALL update `CategoriesTable.jsx` with translation keys
11. THE System SHALL update `AddCategoryForm.jsx` with translation keys
12. THE System SHALL update `UpdateCategoryForm.jsx` with translation keys
13. THE System SHALL update `OrdersManagement.jsx` and related components with translation keys
14. THE System SHALL update `OrdersTable.jsx` with translation keys
15. THE System SHALL update `UpdateOrderForm.jsx` with translation keys
16. THE System SHALL update `UsersManagement.jsx` and related components with translation keys
17. THE System SHALL update `UsersTable.jsx` with translation keys

### Requirement 6: Handle Form Validation Messages

**User Story:** As an administrator, I want form validation messages to appear in my selected language, so that I understand what corrections are needed.

#### Acceptance Criteria

1. WHEN form validation fails, THE System SHALL display error messages using translation keys
2. WHEN displaying validation errors, THE System SHALL support parameter interpolation for dynamic values
3. THE System SHALL translate placeholder text in form inputs
4. THE System SHALL translate button labels in forms
5. THE System SHALL translate field labels in forms

### Requirement 7: Preserve Existing Functionality

**User Story:** As an administrator, I want the admin panel to work exactly as before, so that internationalization doesn't break existing features.

#### Acceptance Criteria

1. WHEN updating components, THE System SHALL preserve all existing functionality
2. WHEN updating components, THE System SHALL maintain all event handlers and state management
3. WHEN updating components, THE System SHALL preserve all styling and CSS classes
4. WHEN updating components, THE System SHALL maintain all data fetching and mutations
5. WHEN translations are not found, THE System SHALL display the translation key as fallback text

### Requirement 8: Support Dynamic Content

**User Story:** As an administrator, I want dynamic content like counts and names to display correctly with translations, so that the interface remains clear and informative.

#### Acceptance Criteria

1. WHEN displaying counts, THE System SHALL support parameter interpolation in translation strings
2. WHEN displaying dates, THE System SHALL format dates according to locale conventions
3. WHEN displaying currency, THE System SHALL format currency according to locale conventions
4. WHEN displaying status values, THE System SHALL translate status labels (PENDING, COMPLETED, CANCELLED)
5. WHEN displaying role values, THE System SHALL translate role labels (ADMIN, CUSTOMER)

### Requirement 9: Maintain Translation Consistency

**User Story:** As a developer, I want consistent translations across the admin panel, so that the user experience is cohesive.

#### Acceptance Criteria

1. WHEN the same text appears in multiple places, THE System SHALL use the same translation key
2. WHEN common actions appear (Edit, Delete, View, Save), THE System SHALL use keys from "admin.common" or "common"
3. WHEN pagination text appears, THE System SHALL use consistent translation keys
4. WHEN status indicators appear, THE System SHALL use consistent translation keys
5. THE System SHALL reuse existing "common" translations where applicable

### Requirement 10: Test Translation Coverage

**User Story:** As a developer, I want to verify all admin text is translated, so that no hard-coded strings remain.

#### Acceptance Criteria

1. WHEN reviewing admin pages, THE System SHALL have no hard-coded English strings
2. WHEN reviewing admin components, THE System SHALL have no hard-coded English strings
3. WHEN switching languages, THE System SHALL display all text in the selected language
4. WHEN a translation key is missing, THE System SHALL display the key itself as fallback
5. THE System SHALL maintain the same visual layout across all languages
