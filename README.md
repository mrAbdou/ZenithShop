# ZenithShop 🚀🛒

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-0C7CBF?style=flat&logo=prisma)](https://prisma.io)
[![GraphQL](https://img.shields.io/badge/GraphQL-Yoga-E10098?style=flat&logo=graphql)](https://the-guild.dev/graphql/yoga-server)
[![Auth](https://img.shields.io/badge/Better%20Auth-2-000000?style=flat&logo=data:image/svg+xml;base64,...](https://better-auth.com) <!-- Placeholder badge -->

**ZenithShop** is a blazing-fast, full-stack e-commerce platform built with the latest web technologies. Inspired by the iconic Zenith in Constantine, Algeria—aiming to elevate local and global shopping to new heights!

## ✨ Key Features
- **Product Catalog**: Browse & detail views (`/products/[id]`).
- **Shopping Cart**: Add items, view cart (`/cart`), seamless checkout (`/checkout`).
- **Secure Authentication**: Better Auth with sessions, providers (Google, etc.).
- **Admin Control Panel**: Manage products/orders (`/control-panel`).
- **GraphQL API**: Powered by Yoga Server for flexible queries/mutations.
- **Responsive UI**: Next.js App Router, Tailwind CSS, modern components.
- **Database**: Prisma ORM with PostgreSQL/SQLite support (seedable).
- **Coming Soon**: TanStack React Query for advanced caching & optimistic updates.

## 🛠️ Tech Stack
| Frontend | Backend/API | Data | Auth | Other |
|----------|-------------|------|------|-------|
| Next.js 14 (App Router) | GraphQL Yoga | Prisma ORM | Better Auth | Tailwind CSS, TypeScript |

## 🚀 Quick Start
```bash
git clone https://github.com/yourusername/zenithshop.git
cd zenithshop
npm install
cp .env.example .env  # Add DB_URL, AUTH_SECRET, etc.
npx prisma db push
npm run dev
