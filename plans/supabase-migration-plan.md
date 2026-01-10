# 🚀 Supabase Migration Plan: From Local PostgreSQL to Supabase

## 📋 Overview

This comprehensive guide provides step-by-step instructions for migrating your Next.js + Prisma + GraphQL application from a local PostgreSQL database to Supabase, a cloud-based PostgreSQL database with additional features like file storage, authentication, and real-time capabilities.

## 🎯 Benefits of Supabase Migration

### ✅ Advantages of Supabase:
- **Cloud-based PostgreSQL**: No need to manage local database servers
- **Built-in Authentication**: Ready-to-use auth system
- **File Storage**: Integrated storage for files and media
- **Real-time Capabilities**: WebSocket support for live updates
- **Scalability**: Easy to scale as your application grows
- **Dashboard & Analytics**: Web-based management interface
- **Free Tier**: Generous free tier for development and small projects

### 🔄 What Changes:
- Database connection string
- Environment variables
- Prisma configuration
- Authentication system (optional)
- File storage (optional)

## 🛠️ Prerequisites

### Required Tools:
- Supabase account (free tier available)
- Node.js and npm/yarn installed
- Existing Next.js project with Prisma
- Git for version control

### Current Project Structure:
```
next-prisma-graph/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── .env
├── package.json
└── ...
```

## 📝 Step-by-Step Migration Guide

### Phase 1: Supabase Setup & Planning

#### Step 1.1: Create Supabase Account
- Go to [https://supabase.com](https://supabase.com) ✔
- Sign up for a free account ✔
- Verify your email address ✔

#### Step 1.2: Create New Project
1. Click "New Project" button ✔
2. Enter project name: `ZenithShop` ✔
3. Choose database password (remember this! `S5A/+.WQR@CX4pU`) ✔
4. Select region closest to your users ✔ Europe
5. Click "Create Project" ✔
6. Wait 2-3 minutes for project initialization ✔

#### Step 1.3: Access Project Dashboard
- Once created, you'll be redirected to project dashboard ✔
- Note the URL: `https://app.supabase.com/project/[your-project-id]` ✔

#### Step 1.4: Free Tier Considerations
- 500MB database storage ✔
- 1GB file storage ✔
- 2GB bandwidth per month ✔
- Monitor usage in dashboard to avoid unexpected costs ✔

### Phase 2: Database Configuration

#### Step 2.1: Get Connection Details
1. In Supabase dashboard, go to **Project Settings** (gear icon) ✔
2. Navigate to **Database** section  ✔
3. Find "Connection string" section  ✔
4. Copy the **URI** (PostgreSQL connection string) ✔

Example format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.ddtdjzntsgbevivyuhrg.supabase.co:5432/postgres
```

#### Step 2.2: Update Environment Variables
1. Open your project's `.env` file ✔
2. Replace the existing `DATABASE_URL` with Supabase connection string ✔
3. Add Supabase-specific environment variables 

```env
# Old local PostgreSQL (remove or comment out)
# DATABASE_URL="postgresql://postgres:password@localhost:5432/next-prisma-graph"

# New Supabase connection (SSL required)
DATABASE_URL="postgresql://postgres.[your-project-id]:[your-password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require"✔

# Supabase specific variables
NEXT_PUBLIC_SUPABASE_URL="https://[your-project-id].supabase.co"✔
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"✔
SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"✔
```

#### Step 2.3: Get Supabase API Keys
1. In Supabase dashboard, go to **Project Settings** > **API** ✔
2. Find "Project API keys" section ✔
3. Copy:
   - `anon` key (public) ✔
   - `service_role` key (secret - keep this private!) ✔

#### Step 2.4: Better Auth Compatibility
**Important**: If you're keeping Better Auth (recommended), no authentication changes are needed!
- Better Auth works seamlessly with Supabase PostgreSQL
- Simply update `DATABASE_URL` - all Better Auth tables and functionality remain intact
- Your existing auth system continues working without modifications

### Phase 3: Prisma Configuration

#### Step 3.1: Update Prisma Schema
1. Open `prisma/schema.prisma` ✔
2. Update the `datasource` block: ✔

```prisma
// Before
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// After (same structure, but will use new connection)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_URL") // Add this for better performance
}
```

#### Step 3.2: Install Supabase Client
```bash
npm install @supabase/supabase-js ✔
# or
pnpm add @supabase/supabase-js
```

### Phase 3.5: Data Backup Strategy (Critical) 
Before migrating, create a backup of your current data:

```bash
# Export current local data (if any exists)
npx prisma db pull > backup.sql
# or for PostgreSQL directly
pg_dump your_local_db > backup.sql
```
-- I'm the user responsible of this app developpement i don't this step is critical as you say, because all of the data in the database are just seed from the file prisma/seed.js---

**Rollback Plan**: Keep local database running during migration. If issues arise, revert `DATABASE_URL` to local connection.

### Phase 4: Database Migration

#### Step 4.1: Push Schema to Supabase
```bash
npx prisma db push ✔
```

This will:
- Create all tables defined in your schema
- Set up relationships
- Create indexes

#### Step 4.2: Seed Database (Optional)
If you have existing data:
```bash
npx prisma db seed
```

Or manually run your seed script:
```bash
node prisma/seed.js
```

### Phase 5: Update Application Code

#### Step 5.1: Create Supabase Client
Create a new file `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Step 5.2: Update Authentication (Optional)
If you want to use Supabase Auth instead of your current system:

```javascript
// Example: Update auth.js
import { supabase } from './supabase'

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}
```

### Phase 6: File Storage Setup (Optional)

#### Step 6.1: Enable Storage in Supabase
1. Go to Supabase dashboard
2. Navigate to **Storage** section
3. Click "New bucket"
4. Create buckets for your needs (e.g., `products`, `avatars`)

#### Step 6.2: Configure Storage Policies
Set up Row Level Security (RLS) policies for secure access:

**Note**: You cannot directly modify the `storage.objects` table as it is managed by Supabase. Use the Supabase dashboard or SQL editor to configure storage policies.

Alternatively, you can use the Supabase dashboard to set up storage policies:
1. Go to the Supabase dashboard.
2. Navigate to the **Storage** section.
3. Click on the bucket you want to configure (e.g., `avatars`, `products`).
4. Set up policies using the dashboard interface.

#### Step 6.3: Update File Upload Code
```javascript
// Example: Update file upload function
import { supabase } from './supabase'

export async function uploadProductImage(file, productId) {
  const fileName = `${productId}-${Date.now()}.${file.name.split('.').pop()}`

  const { data, error } = await supabase
    .storage
    .from('products')
    .upload(fileName, file)

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('products')
    .getPublicUrl(fileName)

  return publicUrl
}
```

### Phase 7: Testing & Validation

#### Step 7.1: Migration Validation
```bash
# Verify all tables were created
npx prisma db execute --file scripts/verify-migration.sql

# Test database connection and query performance
npx prisma studio --port 5556

# Check Better Auth tables if keeping Better Auth
npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%session%';"
```

#### Step 7.2: Test API Endpoints
Test all your GraphQL endpoints to ensure they work with the new database.

#### Step 7.3: Test Authentication
Test login, signup, and protected routes with Better Auth.

#### Step 7.4: Performance Testing
```bash
# Test query performance
npx prisma db execute --stdin <<< "EXPLAIN ANALYZE SELECT * FROM \"User\" LIMIT 10;"

# Monitor Supabase dashboard for query performance
# Check for any slow queries or connection issues
```

### Phase 8: Deployment

#### Step 8.1: Update Deployment Configuration
Ensure your deployment platform has the new environment variables.

#### Step 8.2: Deploy
```bash
git add .
git commit -m "Migrate from local PostgreSQL to Supabase"
git push
```

Then deploy as usual.

## 🔧 Troubleshooting

### Common Issues and Solutions:

#### 1. Connection Errors
**Error**: `Connection refused` or timeout
**Solution**:
- Check your `DATABASE_URL` format
- Ensure you're using the correct password
- Verify the region/endpoint is correct
- Check Supabase project status

#### 2. SSL Errors
**Error**: SSL certificate issues
**Solution**: Add `?sslmode=require` to your connection string:
```
postgresql://user:password@host:port/database?sslmode=require
```

#### 3. Schema Mismatch
**Error**: Tables already exist or schema conflicts
**Solution**:
```bash
npx prisma migrate reset
npx prisma db push --force
```

#### 4. Authentication Issues
**Error**: Auth not working after migration
**Solution**:
- Ensure you've updated all auth-related code
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Verify CORS settings in Supabase dashboard

## 📊 Migration Checklist

- [x] Created Supabase account
- [x] Created new Supabase project
- [x] Updated `.env` with Supabase credentials
- [x] Installed `@supabase/supabase-js`
- [x] Updated Prisma schema
- [x] Pushed schema to Supabase
- [x] Seeded database (if needed)
- [x] Created Supabase client (required for file storage)
- [x] Updated authentication (not needed - using Better Auth)
- [x] Set up file storage (if needed)
- [x] Tested database connection
- [ ] Tested API endpoints
- [ ] Updated deployment configuration
- [ ] Deployed successfully

## 🎯 Post-Migration Optimization

### Performance Tips:
1. **Enable Connection Pooling**: Supabase provides built-in connection pooling
2. **Use Direct URL**: Add `directUrl` to Prisma datasource for better performance
3. **Optimize Queries**: Use Supabase's query builder for complex operations
4. **Enable Caching**: Consider adding Redis for caching

### Monitoring:
1. Set up Supabase database webhooks
2. Configure alerts for unusual activity
3. Monitor query performance in Supabase dashboard

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Supabase Guide](https://www.prisma.io/docs/guides/database/supabase)
- [Next.js + Supabase Examples](https://supabase.com/docs/guides/with-nextjs)

## 🚨 Important Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client-side code
2. Use row-level security (RLS) in Supabase for data protection
3. Regularly rotate your database password
4. Enable two-factor authentication on your Supabase account
5. Set up proper CORS policies

## ✅ Conclusion

Migrating from local PostgreSQL to Supabase provides significant benefits including cloud hosting, built-in authentication, file storage, and scalability. This migration plan covers all necessary steps from setup to deployment, with troubleshooting guidance for common issues.

The migration process typically takes 1-2 hours depending on your project size and complexity. Once completed, you'll have a more scalable, maintainable, and feature-rich database solution for your Next.js application.
