"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getTweets, type Tweet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import TweetCard from "@/components/TweetCard";
import TweetSkeleton from "@/components/TweetSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function FeedPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchTweets = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getTweets();
            setTweets(data);
        } catch {
            setError(true);
            toast.error("Failed to load tweets");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTweets();
    }, [fetchTweets]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Feed</h1>
                {!authLoading && isAuthenticated && (
                    <Button asChild>
                        <Link href="/create">+ New Tweet</Link>
                    </Button>
                )}
            </div>

            <Separator />

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <TweetSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
                    <p className="text-destructive">Something went wrong loading the feed.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={fetchTweets}>
                        Try Again
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && tweets.length === 0 && (
                <div className="rounded-lg border border-border bg-card p-10 text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                        No tweets yet. Be the first to post!
                    </p>
                    {isAuthenticated && (
                        <Button asChild className="mt-4">
                            <Link href="/create">Create your first tweet</Link>
                        </Button>
                    )}
                </div>
            )}

            {/* Tweet List */}
            {!loading && !error && tweets.length > 0 && (
                <div className="space-y-4">
                    {tweets.map((tweet) => (
                        <TweetCard key={tweet.id} tweet={tweet} onDeleted={fetchTweets} />
                    ))}
                </div>
            )}
        </div>
    );
}
