<div align="center">

<img src="https://img.shields.io/badge/SocialVibe-1.0.0-6d28d9?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnoiLz48L3N2Zz4=" alt="SocialVibe" />

# SocialVibe

**A modern full-stack social media platform built with Next.js, Clerk, and Prisma.**

Connect · Share · Inspire

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📸 Screenshots

> _Add your project screenshots below by replacing the placeholder paths._

| Login Page | Home Feed | Profile Page |
|:---:|:---:|:---:|
| ![Login](docs/images/login.png) | ![Home](docs/images/home.png) | ![Profile](docs/images/profile.png) |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure sign-in / sign-up via Clerk (OAuth + Email) |
| 📝 **Posts** | Create, view, and delete posts with text and images |
| 📸 **Image Uploads** | Instant local preview + background upload via UploadThing |
| ❤️ **Likes** | Optimistic like/unlike with real-time count |
| 💬 **Comments** | Inline comment threads on each post |
| 👤 **Profiles** | User profiles with follow/unfollow, bio, links, and stats |
| 🔔 **Notifications** | Activity feed for likes, comments, and new followers |
| 🌙 **Dark Mode** | Full light/dark theme with system preference detection |
| 📱 **Responsive** | Mobile-first, works beautifully on all screen sizes |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)

### Backend
- **API:** Next.js Server Actions
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Auth:** [Clerk](https://clerk.com/)
- **File Storage:** [UploadThing](https://uploadthing.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- PostgreSQL database (local or [Neon](https://neon.tech/) / [Supabase](https://supabase.com/))
- A [Clerk](https://clerk.com/) account
- An [UploadThing](https://uploadthing.com/) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tharindu-Dharmadasa/SocialVibe.git
cd SocialVibe

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env.local

# 4. Push the database schema
npx prisma db push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ─── Database ───────────────────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# ─── Clerk Authentication ───────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login

# ─── UploadThing (File Uploads) ─────────────────────────────
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id
```

> [!TIP]
> Get your Clerk keys from the [Clerk Dashboard](https://dashboard.clerk.com/) and UploadThing keys from the [UploadThing Dashboard](https://uploadthing.com/dashboard).

---

## 📁 Project Structure

```
SocialVibe/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/           # Auth routes (login)
│   │   ├── profile/          # User profile pages
│   │   ├── notifications/    # Notifications page
│   │   └── api/              # API routes (UploadThing)
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── PostCard.tsx      # Individual post component
│   │   ├── CreatePost.tsx    # Post creation form
│   │   ├── Sidebar.tsx       # Left sidebar (user info)
│   │   └── Navbar.tsx        # Top navigation bar
│   ├── actions/              # Next.js Server Actions
│   └── lib/                  # Utility functions & configs
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── docs/                     # Extended documentation
```

---

## 📚 Documentation

Extended documentation is available in the [`/docs`](./docs/) directory:

- [`01-product-overview.md`](./docs/01-product-overview.md) — Product overview & goals
- [`02-architecture-and-tech-stack.md`](./docs/02-architecture-and-tech-stack.md) — Architecture deep-dive
- [`03-installation-and-development.md`](./docs/03-installation-and-development.md) — Full dev guide

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss any changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Tharindu Dharmadasa**

[![GitHub](https://img.shields.io/badge/GitHub-Tharindu--Dharmadasa-181717?style=flat-square&logo=github)](https://github.com/Tharindu-Dharmadasa)

---

<div align="center">
  <sub>Built with ❤️ using Next.js, Clerk, Prisma & TailwindCSS</sub>
</div>
