import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { getUserByClerkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LinkIcon, MapPinIcon, Sparkles } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  const profileUrl = `/profile/${authUser.username ?? authUser.emailAddresses[0].emailAddress.split("@")[0]}`;

  return (
    <div className="sticky top-20">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Cover gradient */}
        <div className="h-16 bg-gradient-to-br from-primary/60 via-violet-500/40 to-indigo-500/40" />

        <div className="px-4 pb-4 -mt-8">
          <Link href={profileUrl} className="flex flex-col items-center">
            <Avatar className="w-16 h-16 ring-4 ring-card shadow-lg">
              <AvatarImage src={user.image || "/avatar.png"} />
            </Avatar>
            <div className="mt-3 text-center">
              <h3 className="font-semibold text-foreground leading-tight">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.userName}</p>
            </div>
          </Link>

          {user.bio && (
            <p className="mt-3 text-sm text-muted-foreground text-center leading-relaxed">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-1 text-center">
            <div className="p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
              <p className="font-bold text-foreground">{user._count.following.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div className="relative p-2">
              <div className="absolute inset-y-2 left-0 w-px bg-border" />
              <div className="absolute inset-y-2 right-0 w-px bg-border" />
              <p className="font-bold text-foreground">{user._count.followers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
              <p className="font-bold text-foreground">{user._count.posts?.toLocaleString() ?? 0}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
          </div>

          {/* Location & Website */}
          {(user.location || user.website) && (
            <div className="mt-4 space-y-1.5 border-t border-border pt-4">
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
                  <a
                    href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                    className="text-primary hover:underline truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          )}

          <Link href={profileUrl}>
            <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl text-sm font-medium">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-14 bg-gradient-to-br from-primary/60 via-violet-500/40 to-indigo-500/40" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="font-semibold text-foreground">Welcome to SocialVibe</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Sign in to connect with people, share your thoughts, and stay in the loop.
        </p>
        <div className="flex flex-col gap-2">
          <SignInButton mode="modal">
            <Button className="w-full rounded-xl font-semibold">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full rounded-xl font-medium">
              Create Account
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  </div>
);