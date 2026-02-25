"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
    tweetCount: number;
    followerCount: number;
    followingCount: number;
}

export default function ProfileStats({
    tweetCount,
    followerCount,
    followingCount
}: ProfileStatsProps) {
    return (
        <Card>
            <CardContent className="flex items-center justify-around py-4">
                {/* Tweets */}
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{tweetCount}</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-tight font-semibold">
                        Tweets
                    </p>
                </div>

                {/* Following */}
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{followingCount}</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-tight font-semibold">
                        Following
                    </p>
                </div>

                {/* Followers */}
                <div className="text-center text-primary">
                    <p className="text-2xl font-bold">{followerCount}</p>
                    <p className="text-sm uppercase tracking-tight font-semibold">
                        Followers
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
