"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * /profile/me → Redirects to /profile/<username>
 * This is a convenience route so the header can link to "My Profile"
 * without knowing the username at render time.
 */
export default function MyProfileRedirect() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
            router.push("/login");
        } else {
            router.replace(`/profile/${user.username}`);
        }
    }, [user, isAuthenticated, isLoading, router]);

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
