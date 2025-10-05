"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PenTool } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ModeToggle } from '@/components/dark-mode';
import '../../../styles/prose.css';

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

export default function ViewActivityPage() {
    const params = useParams();
    const activityId = params.id as string;
    const [blogs, setBlogs] = useState<ActivityBlog[]>([]);
    const [activity, setActivity] = useState<{ id: number; title: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`/api/activity-blogs?activityId=${activityId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data);
                    if (data.length > 0) {
                        setActivity(data[0].activity);
                    } else {
                        // Fetch activity info separately if no blogs exist
                        const activityResponse = await fetch(`/api/activities/${activityId}`);
                        if (activityResponse.ok) {
                            const activityData = await activityResponse.json();
                            setActivity(activityData);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, [activityId]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p>กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/activity-course">
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            กลับไปรายการกิจกรรม
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                        ไม่พบกิจกรรมที่ระบุ
                    </h2>
                </div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/activity-course">
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            กลับไปรายการกิจกรรม
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                        ยังไม่มีบล็อกสำหรับกิจกรรม "{activity.title}"
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        เริ่มต้นสร้างบล็อกแรกสำหรับกิจกรรมนี้
                    </p>
                    <Link href={`/add-activity-blog/${activityId}`}>
                        <Button>
                            <PenTool className="mr-2 h-4 w-4" />
                            เขียนบล็อก
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
                <Link href="/activity-course">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        กลับไปรายการกิจกรรม
                    </Button>
                </Link>
                <ModeToggle />
            </div>

            <div className="space-y-8">
                {blogs.map((blog) => (
                    <Card key={blog.id} className="shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant={blog.isPublished ? "default" : "secondary"}>
                                    {blog.isPublished ? 'เผยแพร่แล้ว' : 'ร่าง'}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    เผยแพร่: {new Date(blog.createdAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <CardTitle className="text-2xl">{blog.title}</CardTitle>
                            {blog.updatedAt > blog.createdAt && (
                                <CardDescription>
                                    แก้ไขล่าสุด: {new Date(blog.updatedAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}