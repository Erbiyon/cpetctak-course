"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {

        const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

        if (isLoggedIn === "true") {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.push(redirectTo);
        }
    }, [router, redirectTo]);


    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        );
    }


    if (!isAuthenticated) {
        return null;
    }


    return <>{children}</>;
}