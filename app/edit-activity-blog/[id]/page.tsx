"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

interface ActivityBlog {
    id: number;
    activityId: number;
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

export default function EditActivityBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params.id as string;

    const [blog, setBlog] = useState<ActivityBlog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/activity-blogs/${blogId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                } else {
                    toast.error('ไม่พบบล็อกที่ระบุ');
                    router.push('/activity-course');
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
                toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลบล็อก');
                router.push('/activity-course');
            } finally {
                setIsLoading(false);
            }
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId, router]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p>กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">
                        ไม่พบบล็อกที่ระบุ
                    </h2>
                    <Link href="/activity-course">
                        <Button>กลับไปรายการกิจกรรม</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <SimpleEditor
                mode="edit"
                blogId={parseInt(blogId)}
                activityId={blog.activityId}
                initialContent={blog.content}
                activityTitle={blog.activity.title}
                isPublished={blog.isPublished}
            />
        </div>
    );
}