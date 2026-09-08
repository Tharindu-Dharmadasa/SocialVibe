# SocialVibe Technical Documentation

Welcome to the comprehensive technical documentation for **SocialVibe**—a full-stack, real-time social application built with Next.js 14 (App Router), TypeScript, Prisma ORM, Clerk Authentication, and UploadThing.

This documentation hub provides an end-to-end breakdown of the application architecture, user permissions, database schema, design system, API pipelines, local setup, and deployment workflows.

---

## 📚 Table of Contents

| Section | Topic | Description |
| :--- | :--- | :--- |
| **[01. Product Overview](01-product-overview.md)** | Product Vision & User Roles | Application scope, target audience, feature inventory, user roles, and authorization matrix. |
| **[02. Architecture & Tech Stack](02-architecture-and-tech-stack.md)** | System Design & Directory Structure | High-level system architecture diagram, tech stack breakdown, and complete directory tree. |
| **[03. Installation & Development](03-installation-and-development.md)** | Getting Started Guide | Local environment requirements, environment variable specs, database migrations, and npm scripts. |
| **[04. Routes, Pages & Design System](04-routes-pages-and-design-system.md)** | App Router & UI Architecture | Route inventory, component tree breakdown, and the Signal Design System tokens (Ink, Paper, Signal Orange, Sky). |
| **[05. Auth, API & Data Models](05-auth-api-and-data-models.md)** | Authentication & Data Pipeline | Clerk authentication flow diagram, Prisma database schema, Server Actions breakdown, and UploadThing API integration. |
| **[06. DevOps, Security & Troubleshooting](06-devops-security-troubleshooting.md)** | Deployment, Security & Maintenance | Production deployment guide, security audit, common errors & solutions, and contribution guidelines. |

---

## 🚀 Quick Start for Developers

```bash
# 1. Clone & Install Dependencies
git clone <repository-url>
cd SocialVibe
npm install

# 2. Configure Environment Variables (.env & .env.local)
# Set DATABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY

# 3. Synchronize Database Schema
npx prisma generate
npx prisma db push

# 4. Launch Development Server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to view the running application.

---

## 🔍 Key Architectural Highlights

- **Server-First Architecture**: Built on Next.js 14 App Router with React Server Components (RSC) and Server Actions (`use server`) for server-side mutation pipelines.
- **Identity & Authorization**: Powered by Clerk for authentication with automatic database user synchronization via custom Server Actions (`syncUser`).
- **Relational Data Integrity**: Managed via PostgreSQL & Prisma ORM with cascading deletions and composite unique indexes for likes and follower relationships.
- **Signal Design System**: Editorial UI featuring Ink (`#101114`), Paper (`#F6F3ED`), Signal Orange (`#FF5A36`), Sky (`#5ED2FF`), and 16px rounded cards with crisp structural grid lines.
