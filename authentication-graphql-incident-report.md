# NEXT.JS GRAPHQL AUTHENTICATION FAILURE INCIDENT REPORT

**Date:** December 1, 2025

**Problem Summary:** In Next.js server component (dashboard), better-auth session exists and validates correctly (user with admin role passes safety check, no redirect). However, identical session retrieval in GraphQL API route context (`app/api/graphql/route.js`) fails, returning null session despite correct auth import and working standalone GraphQL server.

---

## PECULIAR PROBLEM DESCRIPTION

### Session Behavior Discrepancy
- **Dashboard Server Component (`app/control-panel/dashboard/page.js`):** ✅ Session retrieved successfully
  - `auth.api.getSession({ headers: await headers() })` returns valid admin session
  - Safety check passes: user not redirected to home page
  - Session context properly handles admin role validation

- **GraphQL API Route Context (`app/api/graphql/route.js`):** ❌ Session retrieval fails
  - Same `auth.api.getSession({ headers: request.headers })` returns `null`
  - Protected GraphQL resolvers throw "unauthorized" errors
  - Despite identical auth import and configuration

### Verification via Standalone Server
- **Standalone GraphQL Server (`app/graphql/server.js`):**
  - Uses identical schema, resolvers, and auth logic
  - Tested on localhost:4000/graphql
  - ✅ GraphQL queries execute successfully with authentication
  - Same user credentials work perfectly
  - Confirms GraphQL schema and resolvers are functional
  - Proves better-auth session works in similar GraphQL context

### Import Path Investigation
**Tested Import Variations for API Route:**
```javascript
// Attempt 1: Standard import
import { auth } from "../../../lib/auth.js";

// Attempt 2: Alias path
import { auth } from "@/lib/auth.js";

// Attempt 3: Direct relative
import { auth } from "../../../../../lib/auth.js";
```
**Result:** All import variations fail identically - session remains null in GraphQL context

### Debug Findings
- Console logs confirm auth import successful (no import errors)
- Instance exists, methods accessible
- `auth.api.getSession()` callable but returns null consistently
- Request headers logged: no cookie header present
- Same user/environment works in standalone server

---

## TECHNICAL ANALYSIS

### Architecture Context
- Next.js application with server components enabled
- Better-auth with `nextCookies()` plugin (cookie-based sessions)
- Two GraphQL implementations:
  - Standalone server (port 4000) - functional authentication
  - Next.js API route (`/api/graphql`) - authentication failure
- Dashboard uses server-side fetches to GraphQL endpoint during SSR

### Key Discrepancy
The identical session that works in dashboard component fails in API route, despite:
- Same user session
- Same better-auth instance
- Same GraphQL schema/resolvers
- Same header-based session extraction method

### CurrentNGvartstanding
The issue appears specific to Next.js API route execution context. Standalone server works identically with same codebase, suggesting Next.js environmental differences affecting session extraction.

---

## DEBUGGING ATTEMPTS

### 1. Import Path Variations
- Multiple relative path syntaxes tested
- Alias imports (`@`) attempted
- Bundle cleaning and cache clear performed
- No variation resolved null session issue

### 2. Header Inspection
```javascript
console.log('Headers in API route:', Object.keys(request.headers));
```
**Result:** Cookie header critically absent from API route requests

### 3. Standalone Server Verification
- Launched `app/graphql/server.js` on port 4000
- Executed identical GraphQL queries
- Authentication succeeded completely
- Confirmed schema/resolvers work with auth context
- Isolated issue to Next.js API route environment

### 4. Session Retrieval Debugging
```javascript
try {
  session = await auth.api.getSession({ headers: request.headers });
  console.log('API Route - Retrieved session:', session);
} catch (error) {
  console.log('API Route - Session error:', error);
}
```
**Consistent Result:** `session = null` with no errors thrown

---

## HYPOTHESIS FOR ROOT CAUSE

### Primary Theory: Request Context Isolation
Next.js API routes receive different request context than standalone servers. Despite same `auth.api.getSession({ headers })` syntax, the headers object might lack cookie information due to Next.js request processing differences.

### Cookie Header Absence
The absolute absence of cookie header in API route suggests Next.js doesn't forward session cookies from browser/client requests in the same way standalone server receives them.

### Code Duplication Impact
Two GraphQL servers exist (one functional, one broken) with identical implementation. The discrepancy proves environmental differences between Next.js API routes and standalone HTTP servers affect better-auth session extraction.

---

## QUESTIONS FOR OTHER AI AGENTS

1. **Next.js API Route Context:** Why would `auth.api.getSession({ headers })` work in standalone server but fail identically in Next.js API route when headers lack cookies?

2. **Cookie Header Propagation:** Why don't Next.js API routes receive cookie headers when standalone server does, despite client-side cookies existing?

3. **Better-auth Environment Differences:** How does execution environment (Next.js vs standalone) affect better-auth's header-based session extraction?

4. **Framework Integration Issues:** Are there known incompatibilities between better-auth and Next.js API route request handling?

5. **Cookie Forwarding Mechanism:** How can server-side cookie state be preserved/forwarded between Next.js components and API routes?

---

## FILES PROVIDING GOOGLE RELEVANT CODE EXAMPLES

**Working Auth Context (Standalone):**
```javascript
// app/graphql/server.js
const session = await auth.api.getSession({ headers: request.headers });
return { prisma, session }; // WORKS: session populated
```

**Broken Auth Context (Next.js API Route):**
```javascript
// app/api/graphql/route.js
const session = await auth.api.getSession({ headers: request.headers });
return { prisma, session }; // FAILS: session = null
```

**Working Component Session:**
```javascript
// app/control-panel/dashboard/page.js
const session = await auth.api.getSession({ headers: await headers() });
// WORKS: admin session exists, redirects bypassed
```

**GraphQL Resolver Auth Check:**
```javascript
allProductsCount: (parent, args, context) => {
  if (!context.session) {
    throw new Error('unauthorized');
  }
  // This throws consistently in API route, never in standalone
};
```

**Auth Configuration:**
```javascript
// lib/auth.js
export const auth = betterAuth({
  plugins: [nextCookies()],
  // ... standard config
});
```

---

## CURRENT STATUS

**Issue:** Ongoing - API route session retrieval fails despite standalone equivalent working perfectly
**Impact:** GraphQL queries blocked due to "unauthorized" resolvers
**Urgency:** High - authentication core functionality broken in production codepath (API route)
**Next Steps:** Insights needed on Next.js/better-auth integration differences

Looking for explanations why identical session extraction succeeds in standalone server but fails in Next.js API route environment.

---

*Report compiled based on observed behavior, debug outputs, and code analysis. Open to all investigative approaches and alternative theories.*
