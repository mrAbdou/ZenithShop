# Project Structure

## Directory Organization

```
app/                          # Next.js App Router pages and API routes
├── actions/                  # Server actions (i18n, upload)
├── api/                      # API routes
│   ├── auth/[...all]/       # Better Auth catch-all route
│   └── graphql/             # GraphQL Yoga endpoint
├── control-panel/           # Admin dashboard pages
│   ├── dashboard/           # Admin metrics
│   ├── products/            # Product management
│   ├── orders/              # Order management
│   ├── categories/          # Category management
│   └── users/               # User management
├── customer-dashboard/      # Customer profile/orders
├── products/                # Product listing and details
├── cart/                    # Shopping cart page
├── checkout/                # Checkout flow
├── auth/                    # Auth pages (login/signup)
├── graphql/                 # GraphQL schema and resolvers
│   ├── queries/             # Query resolvers by domain
│   ├── mutations/           # Mutation resolvers by domain
│   ├── resolvers.js         # Combined resolvers
│   ├── TypeDefinitions.js   # GraphQL schema
│   └── __test__/            # GraphQL tests
├── layout.js                # Root layout
└── page.js                  # Homepage

components/                   # React components
├── admin/                   # Admin-specific components
├── customer/                # Customer-facing components
└── [shared components]      # Shared UI components

lib/                         # Core utilities and configurations
├── auth.js                  # Better Auth configuration
├── auth-client.js           # Client-side auth utilities
├── prisma.js                # Prisma client singleton
├── graphql-client.js        # GraphQL client setup
├── graphql-server.js        # GraphQL server setup
├── supabase.js              # Supabase client
├── constants.js             # App-wide constants
├── ZodValidationError.js    # Custom error class
├── i18n/                    # Internationalization
│   ├── context.js           # i18n React context
│   ├── dictionary.js        # Dictionary loader
│   ├── server.js            # Server-side i18n utilities
│   └── locales/             # Translation files (en, fr, ar)
└── schemas/                 # Zod validation schemas
    ├── auth.schema.js
    ├── user.schema.js
    ├── product.schema.js
    ├── order.schema.js
    ├── orderItem.schema.js
    ├── category.schema.js
    └── __test__/            # Schema tests

services/                    # Business logic layer
├── [domain].client.js       # Client-side service functions
├── [domain].server.js       # Server-side service functions
└── __test__/                # Service tests

hooks/                       # Custom React hooks (TanStack Query)
├── users.js
├── products.js
├── orders.js
└── categories.js

context/                     # React Context providers
├── CartContext.js
├── ProductContext.js
├── CategoryContext.js
├── OrdersFiltersContext.js
└── usersContext.js

prisma/                      # Database
├── schema.prisma            # Prisma schema
├── seed.js                  # Database seeding script
└── migrations/              # Database migrations

public/                      # Static assets
plans/                       # Implementation plans and docs
```

## Key Conventions

### File Naming
- Pages: `page.js` (Next.js App Router convention)
- Components: PascalCase (e.g., `ProductCard.jsx`)
- Utilities/Services: camelCase (e.g., `auth-client.js`)
- Tests: `*.test.js` in `__test__/` directories

### Component Organization
- Admin components in `components/admin/`
- Customer components in `components/customer/`
- Shared components at `components/` root
- Use `.jsx` extension for components, `.js` for utilities

### Data Flow
1. **Pages** (app/) → call server actions or use hooks
2. **Hooks** (hooks/) → use TanStack Query to call services
3. **Services** (services/) → make GraphQL requests
4. **GraphQL** (app/graphql/) → call Prisma through resolvers
5. **Prisma** (lib/prisma.js) → interact with PostgreSQL

### Testing
- Unit tests colocated in `__test__/` directories
- Test files mirror source file names with `.test.js` suffix
- Use Vitest with jsdom environment
- GraphQL resolvers and schemas have dedicated test coverage

### Authentication
- Better Auth handles all auth operations
- Session-based authentication (2-hour expiration)
- Role-based access control (CUSTOMER, ADMIN)
- Auth routes at `/api/auth/[...all]`
- Client utilities in `lib/auth-client.js`

### Internationalization
- Translations in `lib/i18n/locales/` (JSON files)
- Server-side dictionary loading via `getDictionary(locale)`
- Client-side context via `I18nProvider`
- Supported locales: en, fr, ar
