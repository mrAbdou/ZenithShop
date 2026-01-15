# ZenithShop - E-commerce Platform

ZenithShop is a full-stack e-commerce platform inspired by the iconic Zenith in Constantine, Algeria. It provides a complete shopping experience with product browsing, cart management, secure checkout, and an admin control panel.

## Core Features

- **Customer Experience**: Product catalog with detail views, shopping cart with localStorage persistence, secure checkout flow
- **Authentication**: Better Auth integration with email/password and OAuth providers (Google), session-based auth with 2-hour expiration
- **Admin Panel**: Complete control panel at `/control-panel` for managing products, orders, categories, and users
- **Real-time Dashboard**: Live metrics and analytics for admins
- **Internationalization**: Multi-language support (English, French, Arabic) using custom i18n implementation
- **SEO Optimized**: Dynamic metadata for all pages (title, description, Open Graph)

## User Roles

- **CUSTOMER**: Default role, can browse products, manage cart, place orders
- **ADMIN**: Full access to control panel, can manage all resources

## Key Workflows

- Products are organized by categories
- Orders track items with quantities and maintain total calculations
- Cart state persists across sessions via localStorage
- All admin operations require ADMIN role authentication
