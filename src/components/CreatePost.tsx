"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create post.");
    } finally {
      setIsPosting(false);
    }
  };

  const charCount = content.length;
  const maxChars = 500;
  const charPercent = Math.min((charCount / maxChars) * 100, 100);
  const isOverLimit = charCount > maxChars;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm mb-6 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20 flex-shrink-0">
            <AvatarImage src={user?.imageUrl || "/avatar.png"} />
          </Avatar>

          <div className="flex-1 min-w-0">
            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-transparent resize-none outline-none text-base placeholder:text-muted-foreground text-foreground min-h-[80px] leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
              maxLength={maxChars + 50}
            />

            {/* Image upload area */}
            {showImageUpload && (
              <div className="mt-3 relative">
                <ImageUpload
                  endpoint="postImage"
                  value={imageUrl}
                  onChange={(url) => {
                    setImageUrl(url);
                    if (!url) setShowImageUpload(false);
                  }}
                />
                {!imageUrl && (
                  <button
                    type="button"
                    onClick={() => setShowImageUpload(false)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-4 pt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl gap-2 transition-colors ${showImageUpload ? "text-primary bg-primary/10" : ""}`}
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isPosting}
            >
              <ImageIcon className="size-4" />
              <span className="text-sm font-medium">Photo</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Character counter */}
            {charCount > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                  <circle
                    cx="10" cy="10" r="8" fill="none"
                    stroke={isOverLimit ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * (1 - charPercent / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                {charCount > maxChars - 30 && (
                  <span className={`text-xs font-medium tabular-nums ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                    {maxChars - charCount}
                  </span>
                )}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting || isOverLimit}
              size="sm"
              className="rounded-xl px-4 gap-2 font-semibold bg-primary hover:bg-primary/90 shadow-sm"
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
