# ZenithShop 🚀🛒

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-0C7CBF?style=flat&logo=prisma)](https://prisma.io)
[![GraphQL](https://img.shields.io/badge/GraphQL-Yoga-E10098?style=flat&logo=graphql)](https://the-guild.dev/graphql/yoga-server)
[![Auth](https://img.shields.io/badge/Better%20Auth-1-000000?style=flat)](https://better-auth.com)

**ZenithShop** is a blazing-fast, full-stack e-commerce platform built with the latest web technologies. Inspired by the iconic Zenith in Constantine, Algeria—aiming to elevate local and global shopping to new heights!

## ✨ Key Features
- **Product Catalog**: Browse & detail views (`/products/[id]`).
- **Shopping Cart**: Add items, view cart (`/cart`), seamless checkout (`/checkout`).
- **Secure Authentication**: Better Auth with sessions, providers (Google, etc.).
- **Admin Control Panel**: Manage products/orders (`/control-panel`).
- **Add Product Feature**: Admins can create new products via the `addProduct` form.
- **Live Dashboard**: Real-time admin metrics (products, orders, users).
- **GraphQL API**: Powered by Yoga Server with session‑protected routes.
- **Advanced Caching**: TanStack React Query with infinite queries, load‑more button, mutations, cache updates and `invalidateQueries` for data consistency.
- **Cart Sync**: `CartContext` now persists cart state to `localStorage` for session continuity.
- **SEO Ready**: Pages include dynamic metadata (title, description, Open Graph) for better search engine visibility.
- **Responsive UI**: Next.js App Router, Tailwind CSS, modern components.
- **Database**: Prisma ORM with PostgreSQL support.

## 🛠️ Tech Stack
| Frontend | Backend/API | Data | Auth | Other |
|----------|-------------|------|------|-------|
| Next.js 15 (App Router)<br>TanStack Query | GraphQL Yoga | Prisma ORM | Better Auth | Tailwind CSS, JavaScript |

## 🚀 Quick Start
```bash
git clone https://github.com/mrAbdou/ZenithShop.git
cd zenithshop
npm install
cp .env.example .env  # Add DB_URL, AUTH_SECRET, etc.
npx prisma db push
npm run dev
```
