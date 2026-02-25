"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getTweet, updateTweet, getMediaUrl, type TweetImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MAX_NEW_IMAGES = 10;

interface EditPageProps {
    params: Promise<{ id: string }>;
}

interface NewImagePreview {
    file: File;
    previewUrl: string;
}

export default function EditTweetPage({ params }: EditPageProps) {
    const { id } = use(params);
    const tweetId = parseInt(id, 10);

    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [text, setText] = useState("");
    // Existing images from the server (multi-image model)
    const [existingImages, setExistingImages] = useState<TweetImage[]>([]);
    // Legacy single image from old tweets
    const [legacyImage, setLegacyImage] = useState<string | null>(null);
    // New images selected by the user in this edit session
    const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const tweet = await getTweet(tweetId);

                // Owner check: redirect if user doesn't own this tweet
                if (user && tweet.user !== user.username) {
                    toast.error("You can only edit your own tweets");
                    router.push("/feed");
                    return;
                }

                setText(tweet.text);

                // Load existing multi-image data
                if (tweet.images && tweet.images.length > 0) {
                    setExistingImages(tweet.images);
                }

                // Legacy single-image fallback (only if no multi-images exist)
                if ((!tweet.images || tweet.images.length === 0) && tweet.image) {
                    setLegacyImage(getMediaUrl(tweet.image));
                }
            } catch {
                toast.error("Tweet not found");
                router.push("/feed");
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            if (!isAuthenticated) {
                router.push("/login");
            } else {
                load();
            }
        }
    }, [tweetId, user, isAuthenticated, authLoading, router]);

    function handleNewImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remaining = MAX_NEW_IMAGES - newImages.length;
        if (files.length > remaining) {
            toast.error(`You can add up to ${MAX_NEW_IMAGES} new images.`);
        }

        const filesToAdd = files.slice(0, remaining);
        filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setNewImages((prev) => [
                    ...prev,
                    { file, previewUrl: reader.result as string },
                ]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function removeNewImage(index: number) {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    }

    function removeLegacyImage() {
        setLegacyImage(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) {
            toast.error("Tweet text is required");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("text", text);

            // Append any new images being added
            newImages.forEach(({ file }) => {
                formData.append("uploaded_images", file);
            });

            await updateTweet(tweetId, formData);
            toast.success("Tweet updated");
            router.push("/feed");
        } catch {
            toast.error("Failed to update tweet");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading || authLoading) {
        return (
            <div className="flex justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Edit Tweet</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">Tweet</Label>
                            <Textarea
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={4}
                                required
                                className="resize-none"
                            />
                        </div>

                        {/* Existing Images (multi-image model) */}
                        {existingImages.length > 0 && (
                            <div className="space-y-2">
                                <Label>Current Images</Label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {existingImages.map((img) => {
                                        const url = getMediaUrl(img.image);
                                        if (!url) return null;
                                        return (
                                            <div
                                                key={img.id}
                                                className="relative aspect-square overflow-hidden rounded-lg border border-border"
                                            >
                                                <Image
                                                    src={url}
                                                    alt={`Existing image ${img.id}`}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                {/* 
                                                    NOTE: Image deletion is not yet supported by the backend.
                                                    When a DELETE /api/tweets/<id>/images/<img_id>/ endpoint 
                                                    is added, we can enable this button to remove existing images.
                                                */}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    ⚠️ Removing existing images is not yet supported. You can add new images below.
                                </p>
                            </div>
                        )}

                        {/* Legacy single image */}
                        {legacyImage && (
                            <div className="space-y-2">
                                <Label>Current Image</Label>
                                <div className="relative">
                                    <Image
                                        src={legacyImage}
                                        alt="Tweet image"
                                        width={500}
                                        height={300}
                                        className="rounded-lg border border-border object-cover"
                                        unoptimized
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute right-2 top-2"
                                        onClick={removeLegacyImage}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Add New Images */}
                        <div className="space-y-2">
                            <Label htmlFor="new-images">Add Images (optional)</Label>
                            <Input
                                id="new-images"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleNewImageChange}
                                disabled={newImages.length >= MAX_NEW_IMAGES}
                            />
                        </div>

                        {/* New Image Previews */}
                        {newImages.length > 0 && (
                            <div className="space-y-2">
                                <Label>New Images to Add</Label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {newImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                                        >
                                            <Image
                                                src={img.previewUrl}
                                                alt={`New image ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={() => removeNewImage(idx)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/feed")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
