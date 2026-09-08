# 03. Installation & Local Development

## 1. System Requirements

Before running SocialVibe locally, ensure your system has the following tools installed:

- **Node.js**: `v18.17.0` or higher (Recommended: `v20.x`)
- **Package Manager**: `npm` (`v9+`) or `pnpm` (`v8+`)
- **Database**: Accessible PostgreSQL instance (Local installation, Supabase, Neon, or Prisma Accelerate)
- **External Accounts**:
  - [Clerk Dashboard](https://dashboard.clerk.com/) (For API keys)
  - [UploadThing Dashboard](https://uploadthing.com/) (For media upload token)

---

## 2. Environment Variables Specification

The application requires environment variables split between `.env` (server environment) and `.env.local` (local secrets & public keys).

### Required Variables Reference Table

| Variable Name | Required | Scope | Description | Example / Format |
| :--- | :---: | :---: | :--- | :--- |
| `DATABASE_URL` | Yes | Server | PostgreSQL connection string with SSL configuration. | `postgres://user:password@host:5432/dbname?sslmode=require` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Client/Server | Clerk public publishable key. | `pk_test_...` |
| `CLERK_SECRET_KEY` | Yes | Server | Clerk private API secret key. | `sk_test_...` |
| `UPLOADTHING_TOKEN` | Yes* | Server | UploadThing secret API token for server middleware. | `ut_sk_...` |

> [!IMPORTANT]
> *Note on UploadThing: If `UPLOADTHING_TOKEN` is missing, file upload dropzones will throw authorization errors during upload initialization.

### Example Environment Configuration Files

#### `.env` File (Server Configuration)
```env
# PostgreSQL connection string
DATABASE_URL="postgres://username:password@localhost:5432/socialvibe?sslmode=require"
```

#### `.env.local` File (Client & Secret Keys)
```env
# Clerk Authentication Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY

# UploadThing Token Configuration
UPLOADTHING_TOKEN=ut_sk_YOUR_UPLOADTHING_SECRET_TOKEN
```

---

## 3. Step-by-Step Installation Guide

Follow these steps to set up SocialVibe locally:

```bash
# Step 1: Clone the repository
git clone https://github.com/Tharindu-Dharmadasa/SocialVibe.git
cd SocialVibe

# Step 2: Install Node.js dependencies
npm install

# Step 3: Configure Environment Variables
# Create .env and .env.local in the workspace root and add required keys (see section 2)

# Step 4: Generate Prisma Client artifacts
npx prisma generate

# Step 5: Push database schema to PostgreSQL
npx prisma db push

# Step 6: Start the local development server
npm run dev
```

Open your browser and navigate to [`http://localhost:3000`](http://localhost:3000).

---

## 4. NPM Scripts Reference

All available project scripts defined in `package.json`:

| Script Command | Command Executed | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts the Next.js development server with hot reloading at `localhost:3000`. |
| `npm run build` | `next build` | Compiles the production build, optimizes assets, and runs static analysis. |
| `npm run start` | `next start` | Starts the compiled production Next.js server. |
| `npm run lint` | `next lint` | Executes Next.js ESLint rules to detect code style & potential errors. |
| `npm run postinstall` | `prisma generate` | Automatically runs after `npm install` to generate Prisma TypeScript client code. |

---

## 5. Local Database Management Workflows

### Useful Prisma CLI Commands

```bash
# Push schema changes directly to development database (without creating migrations)
npx prisma db push

# Open interactive browser database GUI (Prisma Studio)
npx prisma studio

# Formats the prisma/schema.prisma file
npx prisma format

# Inspect database schema and sync Prisma models
npx prisma db pull
```
