"use client"

import { AuthGuard } from "@/components/auth-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { BachelorCourse } from "@/components/bachelor-course";
import { ModeToggle } from "@/components/dark-mode";
import { DiplomaCourse } from "@/components/diploma-course";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminCourse() {
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
                            <h1 className="text-lg font-medium">จัดการหลักสูตร</h1>
                        </div>
                        <div className="px-4">
                            <ModeToggle />
                        </div>
                    </header>
                    <div>
                        <Tabs defaultValue="bachelor" className="w-full px-4 mt-2">
                            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-0 h-auto">
                                <TabsTrigger
                                    value="bachelor"
                                    className="py-2 sm:py-2"
                                >
                                    ปริญญาตรี (ป.ตรี)
                                </TabsTrigger>
                                <TabsTrigger
                                    value="diploma"
                                    className="py-2 sm:py-2"
                                >
                                    ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="bachelor" className="mt-6">
                                <BachelorCourse />
                            </TabsContent>
                            <TabsContent value="diploma" className="mt-6">
                                <DiplomaCourse />
                            </TabsContent>
                        </Tabs>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}