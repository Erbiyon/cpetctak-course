"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, Clock, BookOpen } from 'lucide-react';
import { ModeToggle } from '@/components/dark-mode';
import '@/styles/prose.css';

interface ActivityBlog {
    id: number;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    activity: {
        id: number;
        title: string;
    };
}

export default function PublicActivityDetailPage() {
    const params = useParams();
    const activityId = params.id as string;
    const [blog, setBlog] = useState<ActivityBlog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [readingTime, setReadingTime] = useState(0);

    useEffect(() => {
        const fetchActivityBlog = async () => {
            try {
                const response = await fetch(`/api/public/activity/${activityId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);

                    const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
                    setReadingTime(Math.ceil(wordCount / 200));
                } else {
                    setBlog(null);
                }
            } catch (error) {
                console.error('Error fetching activity blog:', error);
                setBlog(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (activityId) {
            fetchActivityBlog();
        }
    }, [activityId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">กำลังโหลด...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-12 text-center">
                            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                            <CardTitle className="mb-4">
                                ไม่พบกิจกรรมที่ระบุ
                            </CardTitle>
                            <CardDescription className="mb-6">
                                กิจกรรมนี้อาจไม่ได้เผยแพร่หรือไม่มีอยู่ในระบบ
                            </CardDescription>
                            <Link href="/">
                                <Button>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    กลับไปรายการกิจกรรม
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-background border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                กลับไปรายการกิจกรรม
                            </Button>
                        </Link>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            <article className="container mx-auto px-4 py-8 max-w-4xl">
                <Card className="mb-8">
                    <CardHeader>
                        <div className="mb-4">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                กิจกรรมหลักสูตร
                            </Badge>
                        </div>

                        <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                            {blog.activity.title}
                        </CardTitle>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                            <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                เผยแพร่เมื่อ {new Date(blog.createdAt).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                อ่าน {readingTime} นาที
                            </div>
                            {blog.updatedAt > blog.createdAt && (
                                <div className="flex items-center">
                                    <span>อัพเดทล่าสุด {new Date(blog.updatedAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                <Card className="mb-8">
                    <CardContent className="p-6 md:p-8">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </CardContent>
                </Card>
            </article>
        </div>
    );
}