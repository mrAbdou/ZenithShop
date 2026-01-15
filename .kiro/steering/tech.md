# Technology Stack

## Core Technologies

- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: PostgreSQL with Prisma ORM v7
- **API**: GraphQL Yoga Server v5
- **Authentication**: Better Auth v1.4
- **State Management**: TanStack React Query v5 (with devtools)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod validation
- **File Storage**: Supabase Storage
- **Testing**: Vitest v4 with jsdom

## Key Libraries

- `@prisma/client` + `@prisma/adapter-pg` - Database ORM
- `graphql` + `graphql-request` + `graphql-yoga` - GraphQL stack
- `better-auth` with `@node-rs/argon2` - Authentication
- `@tanstack/react-query` - Server state management
- `react-hook-form` + `@hookform/resolvers` - Form handling
- `zod` - Schema validation
- `react-hot-toast` - Notifications
- `react-intersection-observer` - Infinite scroll

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:full         # Start GraphQL server + Next.js (concurrently)

# Build & Deploy
npm run build            # Production build
npm start                # Start production server

# Database
npm run seed             # Seed database with initial data
npm run prisma:generate  # Generate Prisma client

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once (CI mode)

# Code Quality
npm run lint             # Run ESLint
```

## Project Configuration

- **Module System**: ES Modules (`"type": "module"` in package.json)
- **Path Aliases**: `@/` maps to project root (configured in jsconfig.json and vitest.config.js)
- **Environment**: Requires `.env` file with `DB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, Supabase credentials
- **Turbopack**: Enabled for faster dev builds
- **Image Optimization**: Configured for Supabase storage domain

## Architecture Patterns

- **Server Components**: Default for all pages, use `'use client'` directive only when needed
- **GraphQL Layer**: All data operations go through GraphQL API at `/api/graphql`
- **Service Layer**: Separate client/server services in `services/` directory
- **Schema Validation**: Zod schemas in `lib/schemas/` for all data models
- **Context Providers**: React contexts for cart, categories, products, orders, users
- **Custom Hooks**: TanStack Query hooks in `hooks/` directory for data fetching
