"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, LogOut, ShieldUser } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'

export function AdminUser() {
    const { isMobile } = useSidebar()
    const router = useRouter()

    const handleLogout = () => {
        // ลบข้อมูล login จาก localStorage
        localStorage.removeItem("isAdminLoggedIn")
        localStorage.removeItem("adminUsername")

        // redirect ไปหน้าหลัก
        router.push("/")
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Image
                                    src="/cpetc-logo.jpg"
                                    width={50}
                                    height={50}
                                    alt="Team Logo"
                                    className="rounded-sm"
                                />
                            </div>
                            <div className="text-left text-sm leading-tight">
                                <span className="truncate font-medium">ผู้ดูแลระบบ</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            ผู้ใช้งาน
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            className="gap-2 p-2"
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border">
                                <ShieldUser />
                            </div>
                            ผู้ดูแลระบบ
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 p-2 text-red-600"
                            onClick={handleLogout}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md">
                                <LogOut />
                            </div>
                            <div className="font-medium">ออกจากระบบ</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
