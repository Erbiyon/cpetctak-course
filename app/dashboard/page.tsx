"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import {
    BookOpen,
    Computer,
    Briefcase,
    Calendar,
    Activity,
    TrendingUp,
    GraduationCap,
    FileText,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
    const [stats, setStats] = useState({
        bachelorSubjects: 0,
        diplomaSubjects: 0,
        activities: 0,
        publishedBlogs: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use the new stats API endpoint
                const response = await fetch('/api/stats')

                if (response.ok) {
                    const data = await response.json()
                    console.log('Stats data:', data)
                    setStats(data)
                } else {
                    console.error('Failed to fetch stats:', response.status)
                    // Fallback to original method
                    const [bachelorRes, diplomaRes, activitiesRes, blogsRes] = await Promise.all([
                        fetch('/api/subjects?type=bachelor'),
                        fetch('/api/subjects?type=diploma'),
                        fetch('/api/activity-course'),
                        fetch('/api/public/activity-blogs')
                    ])

                    const bachelorData = bachelorRes.ok ? await bachelorRes.json() : []
                    const diplomaData = diplomaRes.ok ? await diplomaRes.json() : []
                    const activitiesData = activitiesRes.ok ? await activitiesRes.json() : []
                    const blogsData = blogsRes.ok ? await blogsRes.json() : []

                    setStats({
                        bachelorSubjects: bachelorData.length || 0,
                        diplomaSubjects: diplomaData.length || 0,
                        activities: activitiesData.length || 0,
                        publishedBlogs: blogsData.length || 0
                    })
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])
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
                        {/* Welcome Banner */}
                        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-white/20 p-3">
                                    <Computer className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        ระบบจัดการหลักสูตรวิศวกรรมคอมพิวเตอร์
                                    </h2>
                                    <p className="text-blue-100">
                                        คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ตาก
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">วิชาปริญญาตรี</CardTitle>
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {isLoading ? '...' : stats.bachelorSubjects}
                                    </div>
                                    <p className="text-xs text-muted-foreground">วิชาในหลักสูตร ป.ตรี</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">วิชาประกาศนียบัตร</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {isLoading ? '...' : stats.diplomaSubjects}
                                    </div>
                                    <p className="text-xs text-muted-foreground">วิชาในหลักสูตร ปวส.</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">กิจกรรมทั้งหมด</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {isLoading ? '...' : stats.activities}
                                    </div>
                                    <p className="text-xs text-muted-foreground">กิจกรรมในระบบ</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">บทความที่เผยแพร่</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {isLoading ? '...' : stats.publishedBlogs}
                                    </div>
                                    <p className="text-xs text-muted-foreground">บทความที่เผยแพร่แล้ว</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Quick Actions */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        การจัดการ
                                    </CardTitle>
                                    <CardDescription>
                                        เครื่องมือจัดการหลักสูตรและกิจกรรม
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href="/course">
                                        <Button variant="outline" className="w-full justify-start">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            จัดการรายวิชา
                                        </Button>
                                    </Link>
                                    <Link href="/activity-course">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Activity className="mr-2 h-4 w-4" />
                                            จัดการกิจกรรม
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* System Overview */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Computer className="h-5 w-5 text-green-600" />
                                        ภาพรวมระบบ
                                    </CardTitle>
                                    <CardDescription>
                                        สถานะและข้อมูลสำคัญของระบบ
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                                                    <GraduationCap className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">หลักสูตรปริญญาตรี</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isLoading ? 'กำลังโหลด...' : `${stats.bachelorSubjects} รายวิชา`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                                                    <BookOpen className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">หลักสูตรประกาศนียบัตร</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isLoading ? 'กำลังโหลด...' : `${stats.diplomaSubjects} รายวิชา`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                                                    <Activity className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">ระบบกิจกรรม</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isLoading ? 'กำลังโหลด...' : `${stats.activities} กิจกรรม, ${stats.publishedBlogs} บทความ`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Info */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-orange-600" />
                                        อาชีพหลังจบการศึกษา
                                    </CardTitle>
                                    <CardDescription>โอกาสในการทำงานที่หลากหลาย</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm">นักพัฒนาซอฟต์แวร์ (Software Developer)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm">นักวิเคราะห์ระบบ (System Analyst)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                            <span className="text-sm">ผู้จัดการโครงการ IT (IT Project Manager)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            <span className="text-sm">ผู้ประกอบการด้านเทคโนโลยี</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <span className="text-sm">นักวิเคราะห์ข้อมูล (Data Analyst)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-indigo-600" />
                                        ข้อมูลสำคัญ
                                    </CardTitle>
                                    <CardDescription>ข้อมูลทั่วไป</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="font-medium">คณะวิทยาศาสตร์และเทคโนโลยี</p>
                                            <p className="text-muted-foreground">มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ตาก</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">หลักสูตร</p>
                                            <p className="text-muted-foreground">วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">อัพเดทล่าสุด</p>
                                            <p className="text-muted-foreground">{new Date().toLocaleDateString('th-TH')}</p>
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
