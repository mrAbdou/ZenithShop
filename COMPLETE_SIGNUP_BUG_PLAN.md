# CompleteSignUp Bug Debugging Plan

## Problem Description
The `completeSignUp` resolver function fails with a "null constraint was violated" error. The error occurs when attempting to create an Order record, likely because `context.session.user.id` is null, violating the NOT NULL constraint on `Order.userId`.

## Root Cause Hypothesis
The session is not properly established or available in the GraphQL context when `completeSignUp` executes. This happens because:
1. `authClient.signUp.email()` is called in `SignUpCustomers.js`
2. Immediately followed by `completeSignUp()` GraphQL mutation
3. The session may not be persisted or retrievable yet

## Key Files and Places to Check

### 1. GraphQL Context Setup (`app/api/graphql/route.js`)
- **Location**: Lines 16-30
- **What to check**: How `auth.api.getSession()` retrieves the session from request headers
- **Potential issues**: Session retrieval failing, headers not containing session info, cookies not set properly
- **Debug action**: Add console.log to output the retrieved session object

### 2. CompleteSignUp Resolver (`app/graphql/resolvers.js`)
- **Location**: Lines 232-301
- **What to check**: Transaction logic, specifically `context.session.user.id` usage
- **Potential issues**: Assuming session exists when it might be null
- **Debug action**: Add logging for `context.session` and `context.session.user.id`

### 3. SignUpCustomers Component (`components/SignUpCustomers.js`)
- **Location**: Lines 19-43 (onSubmit function)
- **What to check**: Sequence of `authClient.signUp.email()` followed by `completeSignUp()`
- **Potential issues**: Session not established before GraphQL call
- **Debug action**: Add logging for auth sign up result and check if session is set

### 4. Auth Configuration (`lib/auth.js`)
- **Location**: Entire file
- **What to check**: Better Auth settings, session config, baseURL, secret
- **Potential issues**: Misconfigured session settings, wrong baseURL, invalid secret
- **Debug action**: Verify all configuration values match environment

### 5. Auth Client (`lib/auth-client.js`)
- **Location**: Entire file
- **What to check**: Client configuration matching server settings
- **Potential issues**: baseURL mismatch
- **Debug action**: Ensure client and server baseURL are identical

### 6. Prisma Schema (`prisma/schema.prisma`)
- **Location**: Lines 91-100 (Order model)
- **What to check**: Order.userId field constraints
- **Potential issues**: Field changed to required without default
- **Debug action**: Confirm userId is String (required) with no default

### 7. Database State
- **Location**: Database tables (users, sessions)
- **What to check**: User creation after sign up, session persistence
- **Potential issues**: User not created, session not stored
- **Debug action**: Query database directly after sign up attempt

### 8. Better Auth Documentation
- **Location**: Online documentation
- **What to check**: `signUp.email()` behavior and session creation timing
- **Potential issues**: Method doesn't establish session immediately
- **Debug action**: Understand if sign up auto-logs in user

## Debugging Steps

1. **Add Logging in GraphQL Context**
   - Modify `app/api/graphql/route.js` to log the session object
   - Check if session is null or contains expected user data

2. **Add Logging in Resolver**
   - Modify `completeSignUp` in `resolvers.js` to log context.session
   - Verify user.id is present

3. **Add Logging in Component**
   - Modify `SignUpCustomers.js` to log auth sign up result
   - Check if session cookies are set

4. **Database Verification**
   - After sign up attempt, check if user exists in database
   - Verify session table has entry for the user

5. **Session Matching**
   - Ensure session.user.id matches the created user's id

6. **Configuration Review**
   - Double-check all auth-related environment variables
   - Verify cookie settings and domain

7. **Test Session Availability**
   - Add a simple authenticated query after sign up to test session

8. **Schema Audit**
   - Review recent migrations for schema changes
   - Ensure no unintended NOT NULL constraints added

## Potential Solutions

1. **Modify Signup Flow**
   - Add delay between sign up and completeSignUp
   - Use auth callback to ensure session is established
   - Restructure to sign up, then sign in explicitly

2. **Session Handling**
   - Implement retry logic if session is null
   - Use different auth method that guarantees session

3. **Error Handling**
   - Add better error messages in resolver
   - Handle null session gracefully

## Next Steps
- Implement logging as described
- Run the signup flow and collect logs
- Analyze logs to confirm session availability
- Apply appropriate fix based on findings