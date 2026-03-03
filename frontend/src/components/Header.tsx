"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, mode, setTheme, toggleMode } = useTheme();
    const router = useRouter();

    async function handleLogout() {
        try {
            await logout();
            toast.success("Logged out successfully");
            router.push("/feed");
        } catch {
            toast.error("Logout failed");
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-primary">
                        Pulse<span className="text-accent">Post</span>
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                {mode === "dark" ? "🌙" : "☀️"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={toggleMode}>
                                {mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setTheme("classic")}
                                className={theme === "classic" ? "font-semibold" : ""}
                            >
                                🔵 Classic Theme
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme("modern")}
                                className={theme === "modern" ? "font-semibold" : ""}
                            >
                                🟠 Modern Theme
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Auth Actions */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    @{user?.username}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile/me">👤 My Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    🚪 Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
