"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    // ข้อมูล login ที่ฝังไว้ในโค้ด
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    // ตรวจสอบว่า login แล้วหรือยัง
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
        if (isLoggedIn === "true") {
            router.push("/dashboard");
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // จำลองการ delay เหมือนการเรียก API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // ตรวจสอบ username และ password
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // เก็บสถานะการ login ใน localStorage หรือ session
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("adminUsername", username);

            // redirect ไปหน้า dashboard
            router.push("/dashboard");
        } else {
            setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        }

        setIsLoading(false);
    };

    // แสดง loading ขณะตรวจสอบการ authentication
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">กำลังตรวจสอบ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="flex items-center gap-2 mb-8">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            กลับหน้าหลัก
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
                        <CardDescription>
                            สำหรับผู้ดูแลระบบเท่านั้น
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="กรอกชื่อผู้ใช้"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">รหัสผ่าน</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="กรอกรหัสผ่าน"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                            </Button>
                        </form>

                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            <p>ระบบนี้สำหรับผู้ดูแลเท่านั้น</p>
                            <p>หากไม่มีสิทธิ์เข้าถึง กรุณากลับไปหน้าหลัก</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}