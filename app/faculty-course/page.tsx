import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { ModeToggle } from "@/components/dark-mode";
import { FacultyManagement } from "@/components/faculty-management";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function FacultyCoursePage() {
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
                            <h1 className="text-lg font-medium">บุคลากร</h1>
                        </div>
                        <div className="px-4">
                            <ModeToggle />
                        </div>
                    </header>

                    <main className="flex-1 p-6">
                        <div className="mx-6">
                            <FacultyManagement />
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}