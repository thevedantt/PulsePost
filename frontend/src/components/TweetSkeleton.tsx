import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TweetSkeleton() {
    return (
        <Card>
            <CardContent className="flex gap-3 p-4">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>
        </Card>
    );
}
