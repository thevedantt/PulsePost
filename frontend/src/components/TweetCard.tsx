"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { deleteTweet, getMediaUrl, type Tweet, type TweetImage } from "@/lib/api";
import { toast } from "sonner";

interface TweetCardProps {
    tweet: Tweet;
    onDeleted?: () => void;
}

/**
 * Collects all displayable images from a tweet.
 * Prefers the new `images[]` array, but falls back to legacy `image` field
 * so old tweets (created before the multi-image upgrade) still render.
 */
function getDisplayImages(tweet: Tweet): string[] {
    // New multi-image format takes priority
    if (tweet.images && tweet.images.length > 0) {
        return tweet.images
            .map((img: TweetImage) => getMediaUrl(img.image))
            .filter((url): url is string => url !== null);
    }

    // Legacy single-image fallback
    const legacyUrl = getMediaUrl(tweet.image ?? null);
    if (legacyUrl) return [legacyUrl];

    return [];
}

export default function TweetCard({ tweet, onDeleted }: TweetCardProps) {
    const { user } = useAuth();
    const isOwner = user?.username === tweet.user;
    const displayImages = getDisplayImages(tweet);
    const timeAgo = formatTimeAgo(tweet.created_at);

    // Lightbox state for fullscreen image viewing
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this tweet?")) return;
        try {
            await deleteTweet(tweet.id);
            toast.success("Tweet deleted");
            onDeleted?.();
        } catch {
            toast.error("Failed to delete tweet");
        }
    }

    return (
        <>
            <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="flex gap-3 p-4">
                    {/* Avatar */}
                    <Link href={`/profile/${tweet.user}`}>
                        <Avatar className="h-10 w-10 shrink-0 cursor-pointer transition-opacity hover:opacity-80">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                                {tweet.user[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link href={`/profile/${tweet.user}`} className="font-semibold text-foreground hover:underline">
                                    @{tweet.user}
                                </Link>
                                <span className="text-sm text-muted-foreground">·</span>
                                <span className="text-sm text-muted-foreground">{timeAgo}</span>
                            </div>

                            {/* Owner Actions */}
                            {isOwner && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            ⋯
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/tweets/${tweet.id}/edit`}>✏️ Edit</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className="text-destructive"
                                        >
                                            🗑️ Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Tweet Text */}
                        <p className="mt-1 whitespace-pre-wrap break-words text-foreground">
                            {tweet.text}
                        </p>

                        {/* Image Gallery */}
                        {displayImages.length > 0 && (
                            <ImageGallery
                                images={displayImages}
                                onImageClick={(idx) => setLightboxIndex(idx)}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Fullscreen Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    images={displayImages}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onChange={(idx) => setLightboxIndex(idx)}
                />
            )}
        </>
    );
}


// =====================
// IMAGE GALLERY
// =====================

interface ImageGalleryProps {
    images: string[];
    onImageClick: (index: number) => void;
}

/**
 * Renders tweet images in an adaptive grid layout:
 * - 1 image  → full width
 * - 2 images → 2-column grid
 * - 3 images → 1 large + 2 small
 * - 4+ images → 2x2 grid with "+X" overlay on the last slot
 */
function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
    const count = images.length;
    const MAX_VISIBLE = 4;
    const extraCount = count - MAX_VISIBLE;
    const visibleImages = images.slice(0, MAX_VISIBLE);

    // Single image — full width, clean aspect ratio
    if (count === 1) {
        return (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-border">
                <Image
                    src={visibleImages[0]}
                    alt="Tweet image"
                    width={600}
                    height={400}
                    sizes="(max-width: 600px) 100vw, 600px"
                    className="h-auto w-full cursor-pointer object-cover transition-transform duration-200 hover:scale-[1.02]"
                    onClick={() => onImageClick(0)}
                    unoptimized
                />
            </div>
        );
    }

    // 2 images — simple 2-column grid
    if (count === 2) {
        return (
            <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-xl border border-border">
                {visibleImages.map((src, idx) => (
                    <div key={idx} className="relative aspect-square">
                        <Image
                            src={src}
                            alt={`Tweet image ${idx + 1}`}
                            fill
                            sizes="300px"
                            className="cursor-pointer object-cover transition-transform duration-200 hover:scale-[1.03]"
                            onClick={() => onImageClick(idx)}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        );
    }

    // 3 images — first image tall on left, two stacked on right
    if (count === 3) {
        return (
            <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-xl border border-border">
                {/* Large left image spanning 2 rows */}
                <div className="relative row-span-2 aspect-[3/4]">
                    <Image
                        src={visibleImages[0]}
                        alt="Tweet image 1"
                        fill
                        sizes="300px"
                        className="cursor-pointer object-cover transition-transform duration-200 hover:scale-[1.03]"
                        onClick={() => onImageClick(0)}
                        unoptimized
                    />
                </div>
                {/* Two small images stacked on right */}
                {visibleImages.slice(1).map((src, idx) => (
                    <div key={idx} className="relative aspect-square">
                        <Image
                            src={src}
                            alt={`Tweet image ${idx + 2}`}
                            fill
                            sizes="300px"
                            className="cursor-pointer object-cover transition-transform duration-200 hover:scale-[1.03]"
                            onClick={() => onImageClick(idx + 1)}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        );
    }

    // 4+ images — 2x2 grid with "+X" overlay on last slot if needed
    return (
        <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-xl border border-border">
            {visibleImages.map((src, idx) => (
                <div key={idx} className="relative aspect-square">
                    <Image
                        src={src}
                        alt={`Tweet image ${idx + 1}`}
                        fill
                        sizes="300px"
                        className="cursor-pointer object-cover transition-transform duration-200 hover:scale-[1.03]"
                        onClick={() => onImageClick(idx)}
                        unoptimized
                    />
                    {/* "+X more" overlay on last visible image */}
                    {idx === MAX_VISIBLE - 1 && extraCount > 0 && (
                        <div
                            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-2xl font-bold text-white"
                            onClick={() => onImageClick(idx)}
                        >
                            +{extraCount}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}


// =====================
// LIGHTBOX
// =====================

interface LightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onChange: (index: number) => void;
}

/**
 * Fullscreen lightbox for browsing tweet images.
 * Uses a simple overlay with prev/next navigation.
 */
function Lightbox({ images, currentIndex, onClose, onChange }: LightboxProps) {
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < images.length - 1;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-lg text-white transition-colors hover:bg-black/70"
                onClick={onClose}
            >
                ✕
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1 text-sm text-white">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous button */}
            {hasPrev && (
                <button
                    className="absolute left-4 rounded-full bg-black/50 p-2 text-2xl text-white transition-colors hover:bg-black/70"
                    onClick={(e) => { e.stopPropagation(); onChange(currentIndex - 1); }}
                >
                    ‹
                </button>
            )}

            {/* Main image */}
            <div
                className="relative max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    width={1200}
                    height={800}
                    className="max-h-[85vh] w-auto rounded-lg object-contain"
                    unoptimized
                />
            </div>

            {/* Next button */}
            {hasNext && (
                <button
                    className="absolute right-4 rounded-full bg-black/50 p-2 text-2xl text-white transition-colors hover:bg-black/70"
                    onClick={(e) => { e.stopPropagation(); onChange(currentIndex + 1); }}
                >
                    ›
                </button>
            )}
        </div>
    );
}


// =====================
// UTILITIES
// =====================

function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return "just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30) return `${diffDays}d`;
    return date.toLocaleDateString();
}
