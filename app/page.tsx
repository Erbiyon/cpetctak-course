import { PublicCourseView } from "@/components/public-course-view";
import { AllActivities } from "@/components/all-activities";
import { ModeToggle } from "@/components/dark-mode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/cpetc-logo.jpg"
                            alt="CPETC Logo"
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                        <div>
                            <h1 className="text-xl font-bold">มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ตาก</h1>
                            <p className="text-sm text-muted-foreground">หลักสูตรคอมพิวเตอร์</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button asChild>
                            <Link href="/login">เข้าสู่ระบบ</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">หลักสูตรคอมพิวเตอร์</h2>
                    <p className="text-muted-foreground">
                        ดูรายวิชาและรายละเอียดหลักสูตรทั้งระดับปริญญาตรีและประกาศนียบัตรวิชาชีพชั้นสูง
                    </p>
                </div>

                <Tabs defaultValue="bachelor" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-0 h-auto mb-6">
                        <TabsTrigger
                            value="bachelor"
                            className="py-3 sm:py-2"
                        >
                            ปริญญาตรี (ป.ตรี)
                        </TabsTrigger>
                        <TabsTrigger
                            value="diploma"
                            className="py-3 sm:py-2"
                        >
                            ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)
                        </TabsTrigger>
                        <TabsTrigger
                            value="activities"
                            className="py-3 sm:py-2"
                        >
                            กิจกรรมหลักสูตร
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="bachelor" className="mt-6">
                        <PublicCourseView courseType="bachelor" />
                    </TabsContent>
                    <TabsContent value="diploma" className="mt-6">
                        <PublicCourseView courseType="diploma" />
                    </TabsContent>
                    <TabsContent value="activities" className="mt-6">
                        <AllActivities />
                    </TabsContent>
                </Tabs>

                {/* Important Information Section */}
                <div className="mt-16 grid gap-6 lg:grid-cols-2">
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
                            <CardDescription>ข้อมูลทั่วไปของหลักสูตร</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">คณะวิทยาศาสตร์และเทคโนโลยี</p>
                                    <p className="text-muted-foreground">มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ตาก</p>
                                </div>
                                <div>
                                    <p className="font-medium">หลักสูตร</p>
                                    <p className="text-muted-foreground">วิทยาศาสตรบัณฑิต สาขาคอมพิวเตอร์ธุรกิจ</p>
                                </div>
                                <div>
                                    <p className="font-medium">ระดับการศึกษา</p>
                                    <p className="text-muted-foreground">ปริญญาตรี (ป.ตรี) และ ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</p>
                                </div>
                                <div>
                                    <p className="font-medium">ระยะเวลาศึกษา</p>
                                    <p className="text-muted-foreground">ป.ตรี: 4 ปี, ปวส.: 2 ปี</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
