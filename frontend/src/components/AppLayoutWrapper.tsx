"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
        return <main>{children}</main>;
    }

    return (
        <>
            <Header />
            <main className="mx-auto max-w-2xl px-4 py-6">
                {children}
            </main>
        </>
    );
}
