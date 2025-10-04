"use client"

import { Copyright } from "lucide-react"
import {
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function CpeCopyright() {
    const { state } = useSidebar()

    if (state === "collapsed") {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center justify-center gap-2 p-2 text-sm">
                    <Copyright /> <span>หลักสูตรวิศวกรรมคอมพิวเตอร์</span>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
