# 02. Architecture & Tech Stack

## 1. Technology Stack Overview

**SocialVibe** utilizes a modern full-stack Next.js architecture leveraging React Server Components (RSC) for data fetching and Server Actions for data mutations.

```mermaid
graph TD
    subgraph Client Layer
        Browser["Web Browser (React 18 / Next.js)"]
        UIPrimitives["Radix UI + Lucide Icons"]
        TailwindCSS["Tailwind CSS (Signal Tokens)"]
    end

    subgraph Application Server (Next.js 14 App Router)
        Middleware["Clerk Auth Middleware"]
        Pages["App Router Pages (RSC)"]
        ServerActions["Server Actions (src/actions)"]
        ApiRoutes["UploadThing API Route (/api/uploadthing)"]
    end

    subgraph External Infrastructure & Data Services
        ClerkAuth["Clerk Identity Provider"]
        PrismaORM["Prisma Client"]
        PostgresDB[("PostgreSQL Database")]
        UploadThingCDN["UploadThing CDN Service"]
    end

    Browser -->|HTTP/HTTPS| Middleware
    Middleware --> Pages
    Browser -->|Invoke| ServerActions
    Browser -->|Upload Media| ApiRoutes

    ServerActions -->|Auth Token Sync| ClerkAuth
    ServerActions -->|Type-safe Queries| PrismaORM
    ApiRoutes -->|Presigned Upload| UploadThingCDN
    PrismaORM -->|SQL Connection| PostgresDB
```

---

## 2. Comprehensive Tech Stack Inventory

| Component / Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js | `14.2.15` | Full-stack framework, App Router, SSR & RSC |
| **Runtime Language** | TypeScript | `^5.0.0` | End-to-end strict type safety |
| **UI Library** | React | `^18.3.1` | Component-based view layer |
| **Authentication** | `@clerk/nextjs` | `^6.11.1` | Managed identity, user sessions & auth middleware |
| **Database ORM** | Prisma | `^6.4.1` | Schema modeling, migrations, type-safe queries |
| **Database Service** | PostgreSQL | — | Relational database storage |
| **File Storage** | UploadThing | `^7.6.0` | Cloud media uploads & presigned URL delivery |
| **Styling & CSS** | Tailwind CSS | `^3.4.1` | Utility-first styling, custom theme tokens |
| **UI Components** | Radix UI Primitives | Latest | Accessible unstyled primitives (Dialog, Sheet, Tabs, Avatar) |
| **Icons** | Lucide React | `^0.474.0` | Modern SVG icon set |
| **Utilities** | `clsx` & `tailwind-merge` | Latest | Conditional CSS class merging |
| **Toast Alerts** | `react-hot-toast` | `^2.5.2` | Client-side notification toasts |
| **Date Formatting** | `date-fns` | `^4.1.0` | Human-readable relative time formatting (`formatDistanceToNow`) |

---

## 3. Directory Layout & Folder Structure

Below is the complete file organization of the repository:

```
SocialVibe/
├── .clerk/                      # Local Clerk metadata cache
├── .env                         # Server-side environment variables (DATABASE_URL)
├── .env.local                   # Client & server environment variables (Clerk keys)
├── .next/                       # Next.js build output
├── docs/                        # Technical documentation suite
├── prisma/
│   └── schema.prisma            # Prisma database schema definition
├── public/                      # Static public assets (e.g. avatar fallback)
├── src/
│   ├── actions/                 # Next.js Server Actions (Data Mutations & Fetching)
│   │   ├── notifications.action.ts  # Notification retrieval & read status updates
│   │   ├── post.action.ts           # Post CRUD, likes toggle, and comment creation
│   │   ├── profile.action.ts        # Profile queries, user posts, and profile edits
│   │   └── user.action.ts           # User sync, lookup, follow toggles, random suggestions
│   ├── app/                     # Next.js 14 App Router Directory
│   │   ├── about/
│   │   │   └── page.tsx         # Static about page
│   │   ├── api/
│   │   │   └── uploadthing/
│   │   │       ├── core.ts      # UploadThing router configuration & server middleware
│   │   │       └── route.ts     # UploadThing API endpoint handler
│   │   ├── fonts/               # Local font definitions (GeistVF, GeistMonoVF)
│   │   ├── notifications/
│   │   │   └── page.tsx         # Notifications view page
│   │   ├── profile/
│   │   │   └── [username]/
│   │   │       ├── not-found.tsx          # 404 state for non-existent users
│   │   │       ├── page.tsx               # Server-rendered profile route handler
│   │   │       └── ProfilePageClient.tsx  # Interactive client profile component
│   │   ├── favicon.ico
│   │   ├── globals.css          # Tailwind base, utilities, and CSS custom variables
│   │   ├── layout.tsx           # Root application layout wrapper
│   │   └── page.tsx             # Main Home feed route
│   ├── components/              # Shared Application Components
│   │   ├── ui/                  # Reusable UI Primitives (Card, Button, Dialog, etc.)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── CreatePost.tsx       # Post composer component
│   │   ├── DeleteAlertDialog.tsx# Post deletion confirmation modal
│   │   ├── DesktopNavbar.tsx    # Desktop navigation header
│   │   ├── FollowButton.tsx     # Follow/unfollow action button
│   │   ├── ImageUpload.tsx      # UploadThing dropzone wrapper
│   │   ├── MobileNavbar.tsx     # Mobile header with slide-out sheet menu
│   │   ├── ModeToggle.tsx       # Light/Dark theme toggle dropdown
│   │   ├── Navbar.tsx           # Main navigation wrapper
│   │   ├── NotificationSkeleton.tsx # Skeleton loader for notifications
│   │   ├── PostCard.tsx         # Individual post card item
│   │   ├── Sidebar.tsx          # Left column user profile card
│   │   ├── ThemeProvider.tsx    # Next Themes provider wrapper
│   │   └── WhoToFollow.tsx      # Right column creator recommendation widget
│   ├── lib/                     # Infrastructure Integrations & Helpers
│   │   ├── prisma.ts            # Singleton Prisma Client instance
│   │   ├── uploadthing.ts       # UploadThing client component helpers
│   │   └── utils.ts             # Tailwind class merge helper (`cn`)
│   └── middleware.ts            # Clerk authentication middleware configuration
├── components.json              # shadcn/ui configuration file
├── next.config.mjs              # Next.js configuration
├── package.json                 # Node dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration & theme extension
└── tsconfig.json                # TypeScript strict configuration
```

---

## 4. Key Architectural Patterns & Decisions

1. **Server Actions for Data Mutations**:
   - Rather than exposing REST API endpoints for user actions, SocialVibe utilizes Next.js Server Actions (`"use server"`). This simplifies client code, enforces server-side type safety, and enables automatic page revalidation via `revalidatePath("/")`.
2. **Database Client Singleton (`src/lib/prisma.ts`)**:
   - Prevents multiple Prisma Client instantiations in Next.js hot-reloading development environment by binding Prisma to `globalThis`.
3. **Optimistic Updates**:
   - Component state for post likes (`optimisticLikes` & `hasLiked` in `PostCard.tsx`) updates immediately on user click, reverting only if the server transaction fails.
4. **Theme Preference Persistence**:
   - Integrated with `next-themes` and `suppressHydrationWarning` on `<html>` to ensure flicker-free rendering across SSR and CSR.
