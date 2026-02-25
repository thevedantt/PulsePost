"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { getMediaUrl, toggleFollow, type Profile } from "@/lib/api";
import { toast } from "sonner";
import { UserPlus, UserCheck } from "lucide-react";

interface ProfileHeaderProps {
    profile: Profile;
    onFollowToggle?: (isFollowing: boolean, newFollowerCount: number) => void;
}

export default function ProfileHeader({ profile, onFollowToggle }: ProfileHeaderProps) {
    const { user, isAuthenticated } = useAuth();
    const isOwner = user?.username === profile.username;
    const avatarUrl = getMediaUrl(profile.avatar);

    const [loading, setLoading] = useState(false);

    async function handleFollow() {
        if (!isAuthenticated) {
            toast.error("Please log in to follow users");
            return;
        }

        setLoading(true);
        try {
            const data = await toggleFollow(profile.username);
            toast.success(data.status === "followed" ? `Following @${profile.username}` : `Unfollowed @${profile.username}`);
            onFollowToggle?.(data.is_following, data.follower_count);
        } catch (err: unknown) {
            toast.error("Failed to update follow status");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Cover area + Avatar */}
            <div className="relative">
                {/* Gradient cover bar */}
                <div className="h-28 rounded-t-lg bg-gradient-to-r from-primary/80 to-accent/60" />

                {/* Avatar — overlaps the cover */}
                <div className="absolute -bottom-12 left-6">
                    {avatarUrl ? (
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-card shadow-lg">
                            <Image
                                src={avatarUrl}
                                alt={`${profile.username}'s avatar`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                                {profile.username[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>

                {/* Actions (top right area) */}
                <div className="absolute right-4 top-32 flex gap-2">
                    {isOwner ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/profile/edit">Edit Profile</Link>
                        </Button>
                    ) : profile.is_following !== null && (
                        /* Only show follow button if it's NOT our own profile */
                        <Button
                            variant={profile.is_following ? "secondary" : "default"}
                            size="sm"
                            onClick={handleFollow}
                            disabled={loading}
                            className="min-w-[100px]"
                        >
                            {profile.is_following ? (
                                <><UserCheck className="mr-2 h-4 w-4" /> Following</>
                            ) : (
                                <><UserPlus className="mr-2 h-4 w-4" /> Follow</>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* User Info — below avatar */}
            <div className="px-6 pt-14">
                <h1 className="text-xl font-bold text-foreground">
                    @{profile.username}
                </h1>

                {profile.bio ? (
                    <p className="mt-1 text-muted-foreground">{profile.bio}</p>
                ) : (
                    <p className="mt-1 italic text-muted-foreground/60">No bio yet</p>
                )}

                <p className="mt-2 text-sm text-muted-foreground">
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>

            <Separator />
        </div>
    );
}
