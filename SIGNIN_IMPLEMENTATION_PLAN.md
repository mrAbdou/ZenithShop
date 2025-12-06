# Sign-In Implementation Plan for Next-Prisma-Graph E-Commerce

## **Current State Analysis**

Your authentication setup is well-structured with Better Auth, but you're missing the sign-in flow for existing users. Currently, the checkout page only shows the `SignUpCustomers` component, forcing existing users to create new accounts.

## **Problem Statement**

Existing users who have already created accounts cannot place additional orders because the checkout flow only supports new user registration. This creates a poor user experience and prevents customer retention.

## **Recommended Implementation Plan**

### **Phase 1: Create Sign-In Component**

**1. Create `components/SignInCustomers.js`**
- Email and password fields with validation
- Use `authClient.signIn.email()` for authentication
- Handle success/error states with toast notifications
- Match the styling of your existing `SignUpCustomers` component

**2. Add Sign-In Schema to `lib/zodSchemas.js`**
```javascript
export const SignInCustomerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});
```

### **Phase 2: Create Auth Toggle Component**

**3. Create `components/CheckoutAuth.js`**
- Component that manages the sign-in vs sign-up toggle
- Shows "Already have an account?" / "Need an account?" links
- Handles the switching between forms
- Checks for existing authentication session

### **Phase 3: Modify Checkout Flow**

**4. Update `app/checkout/page.js`**
- Replace `SignUpCustomers` with new `CheckoutAuth` component
- Add logic to handle already authenticated users
- If user is authenticated, show order completion directly

**5. Create New GraphQL Mutation**
- Add `createOrderForExistingUser` mutation in `resolvers.js`
- Similar to `completeSignUp` but without user creation
- Uses the authenticated user's ID from session

### **Phase 4: Enhanced User Experience**

**6. Update Navigation Logic**
- Modify `NavigationBar.jsx` to handle checkout state
- Show appropriate options for authenticated vs non-authenticated users

**7. Add Session Persistence**
- Handle cart data persistence during authentication
- Ensure cart items survive the sign-in process

## **Technical Implementation Details**

### **Key Components to Create:**

1. **`SignInCustomers.js`** - Pure sign-in form
2. **`CheckoutAuth.js`** - Auth state manager for checkout
3. **`OrderCompletion.js`** - Final order step for authenticated users

### **GraphQL Schema Addition:**
```graphql
createOrderForExistingUser(cart: [CartItemInput!]!): OrderResponse
```

### **Session Management Strategy:**
- Use `authClient.useSession()` to detect authentication state
- Redirect authenticated users to order completion
- Preserve cart data during auth flow using context

### **User Flow Options:**

**Option A: Tab-Based Interface**
- "Sign In" | "Create Account" tabs
- Clean separation of concerns

**Option B: Progressive Disclosure**
- Default to sign-in form
- "New customer? Create account" link
- More streamlined for returning customers

## **Best Practices Recommendation**

I recommend **Option B (Progressive Disclosure)** because:
- Most e-commerce users are returning customers
- Reduces cognitive load
- Better conversion rates
- Matches patterns used by major e-commerce sites

## **Files to Modify:**

1. `lib/zodSchemas.js` - Add sign-in schema
2. `app/checkout/page.js` - Replace component reference
3. `app/graphql/resolvers.js` - Add new mutation
4. `app/graphql/TypeDefinitions.js` - Add new mutation type

## **Files to Create:**

1. `components/SignInCustomers.js`
2. `components/CheckoutAuth.js` 
3. `components/OrderCompletion.js`

## **Implementation Steps Summary:**

1. **Create sign-in validation schema**
2. **Build SignInCustomers component**
3. **Build CheckoutAuth component with toggle logic**
4. **Add createOrderForExistingUser GraphQL mutation**
5. **Update checkout page to use new auth flow**
6. **Test both new and existing user flows**
7. **Handle edge cases (invalid credentials, network errors, etc.)**

## **Current Architecture Context:**

- **Authentication**: Better Auth with Prisma adapter
- **Session Management**: Cookie-based, 2-hour expiration
- **User Roles**: CUSTOMER (default), ADMIN
- **Custom Fields**: phoneNumber, address
- **Current Flow**: Sign-up + Order creation in one step
- **Missing**: Sign-in flow for existing users

## **Success Criteria:**

- [ ] Existing users can sign in during checkout
- [ ] New users can still create accounts
- [ ] Authenticated users see pre-filled information
- [ ] Cart data persists during authentication
- [ ] Error handling works properly
- [ ] Session management works correctly
- [ ] Order creation works for both user types

This plan maintains your existing architecture while seamlessly adding sign-in functionality. The implementation will be backward compatible and won't disrupt your current checkout flow for new customers.