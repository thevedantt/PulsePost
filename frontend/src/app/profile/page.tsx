"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * /profile → Redirects to /profile/me (then to /profile/<username>)
 * if authenticated, or to /login if not.
 */
export default function ProfileIndexRedirect() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated) {
            router.replace("/profile/me");
        } else {
            router.replace("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-t-lg" />
            <div className="space-y-2 px-6 pt-10">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
    );
}
