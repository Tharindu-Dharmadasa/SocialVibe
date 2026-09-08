"use client";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
}

function ProfilePageClient({ isFollowing: initialIsFollowing, user, posts, likedPosts }: ProfilePageClientProps) {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => formData.append(key, value));
    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated!");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Unfollowed" : "Following!");
    } catch {
      toast.error("Failed to update follow status.");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    currentUser?.username === user.userName ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.userName;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Profile Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Cover / Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/70 via-violet-500/50 to-indigo-500/60 relative">
          <div className="absolute inset-0 bg-mesh opacity-60" />
        </div>

        {/* Avatar & Actions */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-card shadow-xl">
              <AvatarImage src={user.image ?? "/avatar.png"} />
            </Avatar>

            <div className="flex gap-2 mb-1">
              {!currentUser ? (
                <SignInButton mode="modal">
                  <Button size="sm" className="rounded-xl gap-2 font-semibold">
                    <UserPlusIcon className="size-4" />
                    Follow
                  </Button>
                </SignInButton>
              ) : isOwnProfile ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-2 font-medium"
                  onClick={() => setShowEditDialog(true)}
                >
                  <EditIcon className="size-3.5" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={isFollowing ? "outline" : "default"}
                  className="rounded-xl gap-2 font-semibold"
                  onClick={handleFollow}
                  disabled={isUpdatingFollow}
                >
                  {isFollowing ? (
                    <><UserCheckIcon className="size-4" /> Following</>
                  ) : (
                    <><UserPlusIcon className="size-4" /> Follow</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Name & Bio */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {user.name ?? user.userName}
            </h1>
            <p className="text-muted-foreground text-sm">@{user.userName}</p>
            {user.bio && (
              <p className="mt-2.5 text-sm text-foreground leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="size-3.5 text-primary/70" />
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                className="flex items-center gap-1.5 text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="size-3.5" />
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3.5 text-primary/70" />
              Joined {formattedDate}
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex gap-5 mt-4 pt-4 border-t border-border">
            <div>
              <span className="font-bold text-foreground">{user._count.following.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1.5">Following</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{user._count.followers.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1.5">Followers</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{user._count.posts.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1.5">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts / Likes Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border border-border rounded-2xl h-auto p-1 bg-card gap-1">
          <TabsTrigger
            value="posts"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
          >
            <FileTextIcon className="size-4" />
            Posts
            <span className="text-xs opacity-70">({posts.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
          >
            <HeartIcon className="size-4" />
            Likes
            <span className="text-xs opacity-70">({likedPosts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
            ) : (
              <div className="text-center py-16 rounded-2xl border border-border bg-card">
                <FileTextIcon className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No posts yet</p>
                <p className="text-muted-foreground/60 text-sm mt-1">When {isOwnProfile ? "you share" : "they share"} a post, it'll appear here.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="likes" className="mt-4">
          <div className="space-y-4">
            {likedPosts.length > 0 ? (
              likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
            ) : (
              <div className="text-center py-16 rounded-2xl border border-border bg-card">
                <HeartIcon className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No liked posts yet</p>
                <p className="text-muted-foreground/60 text-sm mt-1">Posts {isOwnProfile ? "you like" : "they like"} will show up here.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "name", label: "Display Name", placeholder: "Your name", type: "input" },
              { key: "bio", label: "Bio", placeholder: "Tell the world about yourself", type: "textarea" },
              { key: "location", label: "Location", placeholder: "Where are you based?", type: "input" },
              { key: "website", label: "Website", placeholder: "https://yourwebsite.com", type: "input" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-sm font-medium">{label}</Label>
                {type === "textarea" ? (
                  <Textarea
                    value={editForm[key as keyof typeof editForm]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="min-h-[90px] rounded-xl resize-none"
                    placeholder={placeholder}
                  />
                ) : (
                  <Input
                    value={editForm[key as keyof typeof editForm]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="rounded-xl"
                    placeholder={placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit} className="rounded-xl font-semibold">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePageClient;