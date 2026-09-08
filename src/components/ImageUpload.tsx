"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  value: string;
  endpoint: "postImage";
}

// ---------------------------------------------------------------------------
// Inner component — remounted on every new upload session via `key` prop.
// This ensures `useUploadThing` always starts with a clean, fresh state and
// never re-uses presigned URLs from a previous upload (which causes 400s).
// ---------------------------------------------------------------------------
interface ImageUploadCoreProps {
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  endpoint: "postImage";
  onRemove: () => void;
}

function ImageUploadCore({ onChange, onFileSelect, endpoint, onRemove }: ImageUploadCoreProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url;
      if (url) {
        onChange(url);
        setLocalPreview(null);
      }
      setIsUploading(false);
    },
    onUploadError: (err) => {
      console.error(err);
      toast.error("Image upload failed. Please try again.");
      setLocalPreview(null);
      setIsUploading(false);
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      onFileSelect?.(file);

      setIsUploading(true);
      startUpload([file]);
    },
    [startUpload, onFileSelect]
  );

  const handleRemove = () => {
    setLocalPreview(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove(); // tells outer wrapper to bump sessionKey → remounts this component
  };

  // Show local preview while uploading
  if (localPreview) {
    return (
      <div className="relative w-full max-h-80 rounded-xl overflow-hidden group">
        <img
          src={localPreview}
          alt="Local preview"
          className="w-full h-full object-cover rounded-xl"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Uploading…
            </div>
          </div>
        )}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full shadow-lg transition-all"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  // Default: file picker drop zone
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-border hover:border-primary/50 rounded-xl cursor-pointer transition-colors bg-muted/30 hover:bg-accent/30 group"
    >
      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <ImageIcon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Click to add a photo</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 4MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Outer wrapper — owns the confirmed server URL and the session key.
// Bumping `sessionKey` fully remounts <ImageUploadCore> (and its hook).
// ---------------------------------------------------------------------------
function ImageUpload({ onChange, onFileSelect, value, endpoint }: ImageUploadProps) {
  const [sessionKey, setSessionKey] = useState(0);

  const handleRemove = () => {
    onChange("");
    onFileSelect?.(null);
    setSessionKey((k) => k + 1); // force-remount the inner component
  };

  // If we already have a confirmed server URL, show that
  if (value) {
    return (
      <div className="relative w-full max-h-80 rounded-xl overflow-hidden group">
        <img
          src={value}
          alt="Upload preview"
          className="w-full h-full object-cover rounded-xl"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <ImageUploadCore
      key={sessionKey}
      endpoint={endpoint}
      onChange={onChange}
      onFileSelect={onFileSelect}
      onRemove={handleRemove}
    />
  );
}

export default ImageUpload;
