"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile, type Profile } from "@/lib/api";
import EditProfileForm from "@/components/EditProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditProfilePage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        async function load() {
            try {
                const data = await getMyProfile();
                setProfile(data);
            } catch {
                toast.error("Failed to load profile");
                router.push("/feed");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [isAuthenticated, authLoading, router]);

    if (loading || authLoading) {
        return (
            <div className="flex justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-10 w-48" />
                        </div>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="flex justify-center">
            <EditProfileForm profile={profile} />
        </div>
    );
}
