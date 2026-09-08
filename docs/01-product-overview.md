# 01. Product Overview & User Roles

## 1. Product Vision & Target Audience

**SocialVibe** is a modern, high-performance social networking platform tailored for digital creators, writers, and niche online communities. The application emphasizes high-contrast editorial typography, crisp content streams, and fast interaction feedback.

### Key Value Propositions
- **Editorial Design System**: Customized "Signal" design language focused on readability, crisp structural layout grids, and vivid interaction states.
- **Instant Media Sharing**: Direct cloud image uploading integrated seamlessly into post composition.
- **Creator-Centric Profiles**: Comprehensive profile pages showcasing published signals, liked content, location tags, personal web links, and community follower graphs.
- **Real-Time Notification Feedback**: Automated alerts for creator engagement (likes, comments, and new followers).

---

## 2. Core Feature Inventory

Based directly on codebase inspection (`src/app/`, `src/actions/`, `prisma/schema.prisma`):

| Feature Category | Description | Implementation Source |
| :--- | :--- | :--- |
| **Authentication** | Modal-based Sign In / Sign Up, Clerk session management, and server-side sync. | Clerk SDK, `src/components/Navbar.tsx`, `src/actions/user.action.ts` |
| **Content Broadcast** | Write text posts, attach images via UploadThing, publish to global feed. | `src/components/CreatePost.tsx`, `src/actions/post.action.ts` |
| **Social Feed** | Chronological feed of creator posts with author information, timestamps, and media previews. | `src/app/page.tsx`, `src/components/PostCard.tsx` |
| **Likes & Reactions** | Optimistic toggle like/unlike mechanism with server transaction and notification triggers. | `PostCard.tsx`, `toggleLike()` in `post.action.ts` |
| **Comment Threads** | Nested comment view per post, inline comment creation, and author badges. | `PostCard.tsx`, `createComment()` in `post.action.ts` |
| **Follow Graph** | Follow/unfollow creators, display random user recommendations ("Who to Follow"). | `WhoToFollow.tsx`, `FollowButton.tsx`, `user.action.ts` |
| **Creator Profiles** | Profile headers with follower/following counts, bio, website link, joined date, and tabbed view for posts vs liked posts. | `src/app/profile/[username]/ProfilePageClient.tsx`, `profile.action.ts` |
| **Notification Hub** | Centralized notification list tracking unread status for likes, comments, and new followers. | `src/app/notifications/page.tsx`, `notifications.action.ts` |
| **Theme Switching** | Light (Paper `#F6F3ED`) / Dark (Ink `#101114`) mode toggle. | `next-themes`, `ThemeProvider.tsx`, `ModeToggle.tsx` |

---

## 3. User Roles & Authorization Matrix

The application derives user identity from Clerk authentication tokens mapped to the `User` model in PostgreSQL.

> [!NOTE]
> **Codebase Analysis**: The Prisma schema defines a single `User` model. There are no administrative roles (e.g., `ADMIN`, `MODERATOR`) implemented in the current database schema.

### User Roles Defined
1. **Unauthenticated Visitor (Guest)**: Unauthenticated browser user.
2. **Authenticated Member**: Signed-in user registered via Clerk and synced to the database.
3. **Resource Owner**: Authenticated user who authored a specific `Post` or `Comment`.

### Authorization Matrix

| Action / Capability | Guest | Member | Resource Owner | Enforced At |
| :--- | :---: | :---: | :---: | :--- |
| View Public Feed & Posts | ✅ | ✅ | ✅ | Client Layout / Server Queries |
| View Creator Profiles | ✅ | ✅ | ✅ | Client Layout / `getProfileByUsername` |
| Create New Post | ❌ | ✅ | ✅ | `createPost` action check (`getDbUserId`) |
| Upload Post Media | ❌ | ✅ | ✅ | UploadThing middleware (`auth()`) |
| Like / Unlike Post | ❌ | ✅ | ✅ | `toggleLike` action check |
| Comment on Post | ❌ | ✅ | ✅ | `createComment` action check |
| Follow / Unfollow Creator | ❌ | ✅ | ✅ | `toggleFollow` (prevents self-following) |
| Edit Personal Profile | ❌ | ❌ | ✅ (Own) | `updateProfile` action (`clerkId` match) |
| Delete Post | ❌ | ❌ | ✅ (Author Only) | `deletePost` action (`authorId === userId`) |
