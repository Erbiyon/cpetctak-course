"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Eye } from 'lucide-react';

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

export function AllActivities() {
    const [blogs, setBlogs] = useState<ActivityBlog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublishedBlogs = async () => {
            try {
                const response = await fetch('/api/public/activity-blogs');
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data);
                }
            } catch (error) {
                console.error('Error fetching published blogs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublishedBlogs();
    }, []);

    const getContentPreview = (htmlContent: string, maxLength = 150) => {
        // ลบ HTML tags และตัด content สำหรับแสดงเป็น preview
        const textContent = htmlContent.replace(/<[^>]*>/g, '');
        return textContent.length > maxLength
            ? textContent.substring(0, maxLength) + '...'
            : textContent;
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">กำลังโหลดกิจกรรม...</p>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <Card className="max-w-md mx-auto">
                <CardContent className="p-12 text-center">
                    <CardTitle className="mb-2">
                        ยังไม่มีกิจกรรมที่เผยแพร่
                    </CardTitle>
                    <CardDescription>
                        โปรดรอการอัพเดทกิจกรรมใหม่
                    </CardDescription>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">กิจกรรมทั้งหมด</h3>
                <p className="text-muted-foreground">
                    ติดตามกิจกรรมและความเคลื่อนไหวของหลักสูตรคอมพิวเตอร์ธุรกิจ
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    พบกิจกรรม <span className="font-semibold text-primary">{blogs.length}</span> กิจกรรม
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-3">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                    กิจกรรม
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <CalendarDays className="h-3 w-3 mr-1" />
                                    {new Date(blog.createdAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                                {blog.activity.title}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-3 leading-relaxed">
                                {getContentPreview(blog.content)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    อ่าน 3-5 นาที
                                </div>
                                <Link href={`/public/activity/${blog.activity.id}`}>
                                    <Button size="sm" className="group-hover:shadow-md transition-all duration-200">
                                        <Eye className="h-3 w-3 mr-1" />
                                        อ่านเพิ่มเติม
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}