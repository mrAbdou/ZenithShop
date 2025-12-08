# Customer Dashboard Implementation Plan

## Overview
Implement a customer dashboard for ZenithShop where authenticated customers can view their account information, order history, and manage their profile after completing purchases.

## Current Project Structure
- **Framework**: Next.js 16 with React 19
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **API**: GraphQL with Apollo Client
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query

## User Flow
1. Guest user browses products and adds to cart
2. Proceeds to cart, updates quantities
3. Goes to checkout
4. If first order: creates account (sign up with phone/address)
5. If existing: signs in
6. Order completes automatically
7. Redirects to customer dashboard

## Required Features
- **Account Overview**: Registration date, total orders count
- **Order History**: List of all orders with status, date, total (via myOrders query)
- **Profile Management**: View and edit name, email, address, phone
- **Order Details**: View items, quantities, prices for each order

## Implementation Steps (Checklist)

### Step 1: Create Customer Dashboard Page
- [✔] Create `app/customer-dashboard/page.js`
- [✔] Add authentication check (redirect if not customer)
- [ ] Implement layout with header, metrics, orders table, profile section

### Step 2: Add GraphQL Queries and Mutations
- [ ] Verify `myOrders` query exists in resolvers (for consulting user's orders)
- [ ] Verify `updateUserProfile` mutation exists
- [ ] Create/update services in `services/` for customer queries
- [ ] Create hooks in `hooks/` (useMyOrders, useUpdateProfile)

### Step 3: Create Dashboard Components
- [ ] Create `CustomerDashboardMetrics.js`: Account overview cards
- [ ] Create `OrdersTable.js`: Display user's orders with status badges (using myOrders query)
- [ ] Create `ProfileSection.js`: Show profile info with edit button
- [ ] Create `UpdateProfileForm.js`: Form for editing profile

### Step 4: Update Checkout Flow
- [ ] Modify checkout completion to redirect to `/customer-dashboard`
- [ ] Update `CheckoutAuth.js` for proper redirection

### Step 5: Update Navigation
- [ ] Add "My Account" or "Dashboard" link in `NavigationBar.jsx` for authenticated customers

### Step 6: Testing and Validation
- [ ] Test with sample user data
- [ ] Verify authentication guards
- [ ] Check responsive design
- [ ] Test order consultation via myOrders query

## Existing Infrastructure
- User model: id, name, email, address, phoneNumber, role, orders
- Order model: id, status, total, items, createdAt
- GraphQL resolvers: myOrders, updateUserProfile
- Authentication: Better Auth with session management

## Security Considerations
- All queries/mutations check user authentication
- Customers can only access their own data
- Profile updates validated on backend

## File Structure Additions
```
app/
  customer-dashboard/
    page.js

components/
  CustomerDashboardMetrics.js
  OrdersTable.js
  ProfileSection.js
  UpdateProfileForm.js

services/
  (update existing or add new for customer-specific queries)

hooks/
  (add useMyOrders, useUpdateProfile)
```

## Dependencies
All required packages are already installed:
- @apollo/client
- react-hook-form
- @tanstack/react-query
- better-auth
- etc.

## Next Steps
Ready to proceed with implementation. Each step will be executed in Code mode with proper testing.