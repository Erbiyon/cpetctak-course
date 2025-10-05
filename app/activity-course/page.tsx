import ActivityCourse from "@/components/activity-course";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { ModeToggle } from "@/components/dark-mode";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ActivityCoursePage() {
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
                            <h1 className="text-lg font-medium">จัดการกิจกรรมหลักสูตร</h1>
                        </div>
                        <div className="px-4">
                            <ModeToggle />
                        </div>
                    </header>
                    <ActivityCourse />
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard >
    );
}