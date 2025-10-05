"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import AddActivityCourse from "./add-activity-course";
import EditActivityCourse from "./edit-activity-course";
import AlertDeleteActivity from "./alert-delete-activity";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Eye, PenTool } from "lucide-react";
import Link from "next/link";

interface Activity {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    blogs: {
        id: number;
        isPublished: boolean;
    }[];
}

export default function ActivityCourse() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/activities');
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            } else {
                console.error('Failed to fetch activities');
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/activities/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('ลบกิจกรรมเรียบร้อยแล้ว');
                fetchActivities(); // Refresh the list
            } else {
                toast.error('เกิดข้อผิดพลาดในการลบกิจกรรม');
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        }
    };

    return (
        <Card className="mt-6 mx-4">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>กิจกรรมหลักสูตร</CardTitle>
                        <CardDescription>
                            จัดการกิจกรรมต่างๆ ที่เกี่ยวข้องกับหลักสูตร
                        </CardDescription>
                    </div>
                    <AddActivityCourse onActivityAdded={fetchActivities} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ชื่อกิจกรรม</TableHead>
                                <TableHead>วันที่สร้าง</TableHead>
                                <TableHead>วันที่อัปเดต</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-center">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        กำลังโหลดข้อมูล...
                                    </TableCell>
                                </TableRow>
                            ) : activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        ยังไม่มีกิจกรรม
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell className="font-medium">
                                            {activity.title}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(activity.createdAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(activity.updatedAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const publishedBlog = activity.blogs.find(blog => blog.isPublished);
                                                const isPublished = !!publishedBlog;
                                                return (
                                                    <span className={`px-2 py-1 rounded-full text-xs ${isPublished
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {isPublished ? 'เผยแพร่แล้ว' : 'ร่าง'}
                                                    </span>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <EditActivityCourse
                                                activity={activity}
                                                onActivityUpdated={fetchActivities}
                                            />
                                            {(() => {
                                                // Check if activity has any blogs
                                                const hasBlog = activity.blogs && activity.blogs.length > 0;
                                                const blogId = hasBlog ? activity.blogs[0].id : null;
                                                const href = hasBlog
                                                    ? `/edit-activity-blog/${blogId}`
                                                    : `/add-activity-blog/${activity.id}`;
                                                const title = hasBlog ? "แก้ไขบล็อก" : "เขียนบล็อก";

                                                return (
                                                    <Link href={href}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title={title}
                                                        >
                                                            <PenTool className="text-blue-400" />
                                                        </Button>
                                                    </Link>
                                                );
                                            })()}
                                            <Link href={`/view-activity/${activity.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    title="ดูกิจกรรม"
                                                >
                                                    <Eye className="text-green-400" />
                                                </Button>
                                            </Link>
                                            <AlertDeleteActivity
                                                activity={{
                                                    id: activity.id,
                                                    title: activity.title
                                                }}
                                                onDelete={handleDelete}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}