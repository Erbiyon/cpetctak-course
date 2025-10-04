"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/dark-mode"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    BookOpen,
    Computer,
    Briefcase,
    Calendar,
} from "lucide-react"

export default function Dashboard() {
    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <h1 className="text-lg font-medium">แดชบอร์ด</h1>
                        </div>
                        <div className="px-4">
                            <ModeToggle />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
                        <div className="rounded-lg bg-blue-600 p-6 dark:bg-card border text-white">
                            <div className="flex items-center gap-4">
                                <Computer className="h-12 w-12" />
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        หลักสูตรวิศวกรรมศาสตรบัณฑิต
                                    </h2>
                                    <p className="text-blue-100">
                                        สาขาวิศวกรรมคอมพิวเตอร์
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        วิชาในหลักสูตร
                                    </CardTitle>
                                    <CardDescription>
                                        รายวิชาหลักที่จะได้เรียนในหลักสูตร
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center text-muted-foreground">
                                            กำลังอัปเดตข้อมูลรายวิชา...
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        ข่าวสารและการอัปเดต
                                    </CardTitle>
                                    <CardDescription>ข้อมูลล่าสุดของหลักสูตร</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center text-muted-foreground">
                                            กำลังอัปเดตข่าวสาร...
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-3">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        อาชีพที่สามารถประกอบได้หลังจบ
                                    </CardTitle>
                                    <CardDescription>โอกาสในการทำงานและตำแหน่งงานที่เปิดกว้าง</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center text-muted-foreground">
                                            กำลังอัปเดตข้อมูลอาชีพ...
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    )
}
