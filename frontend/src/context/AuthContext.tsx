"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, logoutUser, type User } from "@/lib/api";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "pulsepost_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore user from localStorage on mount (session awareness)
    useEffect(() => {
        try {
            const stored = localStorage.getItem(USER_STORAGE_KEY);
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            // Ignore parse errors
        }
        setIsLoading(false);
    }, []);

    // Sync user state to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [user]);

    const login = useCallback(async (username: string, password: string) => {
        const data = await loginUser(username, password);
        setUser(data.user);
    }, []);

    const logout = useCallback(async () => {
        await logoutUser();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
