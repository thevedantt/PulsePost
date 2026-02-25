"use client";

import { useEffect, useState, use } from "react";
import { getPublicProfile, type Profile } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";
import TweetCard from "@/components/TweetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ProfilePageProps {
    params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: ProfilePageProps) {
    const { username } = use(params);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getPublicProfile(username);
                setProfile(data);
            } catch (err: unknown) {
                const status = (err as { status?: number }).status;
                if (status === 404) {
                    setNotFound(true);
                } else {
                    toast.error("Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [username]);

    const handleFollowToggle = (isFollowing: boolean, newFollowerCount: number) => {
        if (!profile) return;
        setProfile({
            ...profile,
            is_following: isFollowing,
            follower_count: newFollowerCount,
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-28 w-full rounded-t-lg" />
                <div className="space-y-2 px-6 pt-10">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="mx-auto h-16 w-full max-w-md" />
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <p className="text-4xl">😔</p>
                    <h2 className="mt-4 text-xl font-bold text-foreground">
                        User not found
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        @{username} doesn&apos;t exist or has been removed.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-6">
            {/* Profile Info */}
            <Card className="overflow-hidden">
                <ProfileHeader
                    profile={profile}
                    onFollowToggle={handleFollowToggle}
                />
            </Card>

            {/* Stats */}
            <ProfileStats
                tweetCount={profile.tweet_count ?? 0}
                followerCount={profile.follower_count ?? 0}
                followingCount={profile.following_count ?? 0}
            />

            {/* User's Tweets */}
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Tweets</h2>
            </div>

            {profile.tweets && profile.tweets.length > 0 ? (
                <div className="space-y-4">
                    {profile.tweets.map((tweet) => (
                        <TweetCard key={tweet.id} tweet={tweet} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-muted-foreground">
                            @{profile.username} hasn&apos;t posted yet.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
