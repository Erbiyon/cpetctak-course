"use client"

import * as React from "react"
import {
    BookOpen,
    Home,
    Activity,
    UserRound,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { CpeCopyright } from "@/components/cpe-copyright"
import { AdminUser } from "@/components/admin-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "หน้าหลัก",
            url: "/dashboard",
            icon: Home,
            isActive: true,
            items: [],
        },
        {
            title: "วิชาในหลักสูตร",
            url: "/admin/course",
            icon: BookOpen,
            items: [],
        },
        {
            title: "กิจกรรมหลักสูตร",
            url: "/activity-course",
            icon: Activity,
            items: [],
        },
        {
            title: "บุคลากร",
            url: "/faculty-course",
            icon: UserRound,
            items: [],
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AdminUser />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <CpeCopyright />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
