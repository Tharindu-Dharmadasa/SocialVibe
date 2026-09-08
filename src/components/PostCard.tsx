"use client";

import { createComment, deletePost, getPosts, toggleLike } from '@/actions/post.action';
import { SignInButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { DeleteAlertDialog } from './DeleteAlertDialog';
import { Button } from './ui/button';
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon } from 'lucide-react';

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId));
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked(prev => !prev);
      setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some(like => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted!");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to post comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted.");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 sm:p-5">
        <div className="flex gap-3">
          <Link href={`/profile/${post.author.userName}`} className="flex-shrink-0">
            <Avatar className="size-10 ring-2 ring-border hover:ring-primary/40 transition-all">
              <AvatarImage src={post.author.image ?? "/avatar.png"} />
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/profile/${post.author.userName}`} className="font-semibold text-foreground hover:text-primary transition-colors truncate block">
                  {post.author.name}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Link href={`/profile/${post.author.userName}`} className="hover:text-primary transition-colors">
                    @{post.author.userName}
                  </Link>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                </div>
              </div>
              {dbUserId === post.authorId && (
                <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost} />
              )}
            </div>

            {/* Post content */}
            {post.content && (
              <p className="mt-2.5 text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </p>
            )}
          </div>
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-border">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-1 mt-3 -ml-2">
          {user ? (
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 select-none
                ${hasLiked
                  ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                  : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                }`}
            >
              <HeartIcon className={`size-4 transition-transform ${hasLiked ? "fill-current scale-110" : ""}`} />
              <span>{optimisticLikes}</span>
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                <HeartIcon className="size-4" />
                <span>{optimisticLikes}</span>
              </button>
            </SignInButton>
          )}

          <button
            onClick={() => setShowComments(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150
              ${showComments
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
          >
            <MessageCircleIcon className={`size-4 ${showComments ? "fill-primary/30" : ""}`} />
            <span>{post.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border bg-muted/20 px-4 sm:px-5 py-4 space-y-4">
          {/* Existing comments */}
          {post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-7 flex-shrink-0">
                    <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-card rounded-2xl rounded-tl-sm px-3 py-2 border border-border">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-foreground">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                      </div>
                      <p className="text-sm text-foreground break-words leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          {user ? (
            <div className="flex gap-3">
              <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={user.imageUrl || "/avatar.png"} />
              </Avatar>
              <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-1.5 focus-within:border-primary/50 transition-colors">
                <input
                  type="text"
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 rounded-xl text-muted-foreground hover:text-primary flex-shrink-0"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isCommenting}
                >
                  <SendIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <LogInIcon className="size-3.5" />
                  Sign in to comment
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;