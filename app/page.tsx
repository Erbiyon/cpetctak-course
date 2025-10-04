import { PublicCourseView } from "@/components/public-course-view";
import { ModeToggle } from "@/components/dark-mode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
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
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-0 h-auto mb-6">
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
                    </TabsList>
                    <TabsContent value="bachelor" className="mt-6">
                        <PublicCourseView courseType="bachelor" />
                    </TabsContent>
                    <TabsContent value="diploma" className="mt-6">
                        <PublicCourseView courseType="diploma" />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/50 mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ตาก - ระบบจัดการหลักสูตรคอมพิวเตอร์</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
