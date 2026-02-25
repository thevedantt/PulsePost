"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createTweet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

// Max images allowed per tweet — keeps upload size reasonable
const MAX_IMAGES = 10;

interface ImagePreview {
    file: File;
    previewUrl: string;   // data: URL for local preview before upload
}

export default function CreateTweetPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [text, setText] = useState("");
    const [images, setImages] = useState<ImagePreview[]>([]);
    const [loading, setLoading] = useState(false);

    // Redirect unauthenticated users
    if (!isLoading && !isAuthenticated) {
        router.push("/login");
        return null;
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check combined total doesn't exceed maximum
        const remaining = MAX_IMAGES - images.length;
        if (files.length > remaining) {
            toast.error(`You can add up to ${MAX_IMAGES} images. ${remaining} slot${remaining !== 1 ? "s" : ""} remaining.`);
        }

        const filesToAdd = files.slice(0, remaining);

        // Generate preview URLs for each new file
        filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prev) => [
                    ...prev,
                    { file, previewUrl: reader.result as string },
                ]);
            };
            reader.readAsDataURL(file);
        });

        // Reset the input so the same file(s) can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) {
            toast.error("Tweet text is required");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("text", text);

            // Append each image file under the key the backend expects
            // Backend uses serializers.ListField → key "uploaded_images"
            images.forEach(({ file }) => {
                formData.append("uploaded_images", file);
            });

            await createTweet(formData);
            toast.success("Tweet posted!");
            router.push("/feed");
        } catch {
            toast.error("Failed to create tweet");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Create Tweet</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">What&apos;s on your mind?</Label>
                            <Textarea
                                id="text"
                                placeholder="Share your thoughts..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={4}
                                required
                                className="resize-none"
                            />
                        </div>

                        {/* File Input — supports multiple files */}
                        <div className="space-y-2">
                            <Label htmlFor="images">
                                Images (optional, up to {MAX_IMAGES})
                            </Label>
                            <Input
                                id="images"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={images.length >= MAX_IMAGES}
                            />
                            {images.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {images.length} / {MAX_IMAGES} images selected
                                </p>
                            )}
                        </div>

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                                    >
                                        <Image
                                            src={img.previewUrl}
                                            alt={`Preview ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        {/* Remove button — visible on hover */}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                            onClick={() => removeImage(idx)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? "Posting..." : "Post Tweet"}
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
