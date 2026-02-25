"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateMyProfile, getMediaUrl, type Profile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface EditProfileFormProps {
    profile: Profile;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [bio, setBio] = useState(profile.bio || "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        getMediaUrl(profile.avatar)
    );
    const [submitting, setSubmitting] = useState(false);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setAvatarFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    function removeAvatar() {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("bio", bio);
            if (avatarFile) formData.append("avatar", avatarFile);

            await updateMyProfile(formData);
            toast.success("Profile updated!");
            router.push(`/profile/${profile.username}`);
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Avatar Section */}
                    <div className="space-y-3">
                        <Label>Avatar</Label>
                        <div className="flex items-center gap-4">
                            {/* Current/Preview Avatar */}
                            {avatarPreview ? (
                                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border">
                                    <Image
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                        {profile.username[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div className="flex flex-col gap-2">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="max-w-60"
                                />
                                {avatarPreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeAvatar}
                                        className="w-fit text-destructive"
                                    >
                                        Remove avatar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell the world about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {bio.length}/280 characters
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
