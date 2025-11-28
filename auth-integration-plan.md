# Auth.js Integration Plan for Next.js + Prisma + GraphQL Yoga

## Current Project Assessment
- **Next.js 16** with App Router
- **Prisma 7** with PostgreSQL, existing User model (but password stored in plain text)
- **GraphQL Yoga 5** as API replacement, with basic auth mutations (login/logout) marked as TODO
- No existing authentication system implemented

## Auth.js Integration Plan

### 1. Install Dependencies
- Install `next-auth` (Auth.js), `@auth/prisma-adapter`, and required providers
- Add `bcryptjs` for password hashing (since current schema uses plain text)
- Update package.json and run npm install

### 2. Update Prisma Schema
- Add Auth.js required models: Account, Session, VerificationToken
- Modify User model to remove plain password field and add fields compatible with Auth.js (e.g., emailVerified, image)
- Run Prisma migrations

### 3. Configure Auth.js
- Create `auth.ts` configuration file with Prisma adapter
- Set up credentials provider for email/password login
- Configure session handling (JWT/database)
- Add Next.js API route for Auth.js endpoints (`/api/auth/[...nextauth]`)
- Create environment variables for NEXTAUTH_SECRET and database URL

### 4. Integrate with GraphQL Yoga
- Update GraphQL context to include authenticated user from Auth.js session
- Modify resolvers to check authentication for protected operations
- Update login/logout mutations to use Auth.js instead of custom logic
- Add authorization checks for admin-only mutations (e.g., product management)

### 5. Update Frontend Components
- Modify NavigationBar and other components to show login/logout states
- Add login/register forms using Auth.js providers
- Handle authentication state in client-side components using `useSession` hook
- Update cart and checkout pages to require authentication

### 6. Security Enhancements
- Implement proper password hashing with bcryptjs
- Add rate limiting for auth endpoints if needed
- Secure sensitive GraphQL queries/mutations with auth checks
- Remove password field from GraphQL User type

### 7. Testing and Migration
- Test authentication flow end-to-end (register, login, logout, protected routes)
- Migrate existing user data: hash plain text passwords
- Update seed data to include proper user accounts
- Test admin functionality with role-based access

## Key Considerations
- Auth.js works well with Next.js App Router and can be integrated with GraphQL Yoga
- You'll need to decide between JWT and database sessions (database recommended for GraphQL)
- For GraphQL, authentication context will be populated from Auth.js session
- Existing User model fields (fullName, address, phoneNumber, role) can be preserved
- Provider support: Start with credentials provider, can add OAuth (Google, GitHub) later

## Implementation Order
1. Dependencies and schema updates
2. Auth.js configuration
3. GraphQL integration
4. Frontend updates
5. Testing and data migration
