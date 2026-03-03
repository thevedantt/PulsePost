"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MarketingNavbar() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const { theme, mode, setTheme, toggleMode } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-bold inline-block text-xl tracking-tighter">
                                Pulse<span className="text-primary">Post</span>
                            </span>
                        </Link>
                        <Badge variant="secondary" className="hidden sm:inline-flex text-xs font-medium">
                            Full-Stack Project
                        </Badge>
                    </div>
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="#features">Features</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="#architecture">Architecture</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center justify-end space-x-4">
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

                    {!isLoading && isAuthenticated ? (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/feed">Feed</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/profile/me">Profile</Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => logout()}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
