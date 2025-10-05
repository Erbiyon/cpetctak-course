"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { FilePenLine } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Activity {
    id: number;
    title: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EditActivityCourseProps {
    activity: Activity;
    onActivityUpdated?: () => void;
}

export default function EditActivityCourse({ activity, onActivityUpdated }: EditActivityCourseProps) {
    const [title, setTitle] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Initialize form with activity data when dialog opens
    useEffect(() => {
        if (isOpen && activity) {
            setTitle(activity.title);
            setIsPublished(activity.isPublished);
        }
    }, [isOpen, activity]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('กรุณากรอกชื่อกิจกรรม');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/activities/${activity.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    isPublished,
                }),
            });

            if (response.ok) {
                toast.success('แก้ไขกิจกรรมเรียบร้อยแล้ว');
                setIsOpen(false);
                // Call callback if provided
                if (onActivityUpdated) {
                    onActivityUpdated();
                }
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
            }
        } catch (error) {
            console.error('Error updating activity:', error);
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    title="แก้ไข"
                    onClick={() => setIsOpen(true)}
                >
                    <FilePenLine className="text-yellow-400" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>แก้ไขกิจกรรม</DialogTitle>
                        <DialogDescription>
                            แก้ไขข้อมูลกิจกรรมที่เกี่ยวข้องกับหลักสูตร
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 my-4">
                        <Label htmlFor="edit-activity-title">ชื่อกิจกรรม</Label>
                        <Input
                            type="text"
                            id="edit-activity-title"
                            placeholder="กรอกชื่อกิจกรรม"
                            className="w-full mb-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <Label>วันที่สร้าง</Label>
                                <p className="text-sm">
                                    {new Date(activity.createdAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="edit-status-published"
                                        checked={isPublished}
                                        onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                                    />
                                    <Label htmlFor="edit-status-published">เผยแพร่</Label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setTitle(activity.title);
                                    setIsPublished(activity.isPublished);
                                }}
                            >
                                ยกเลิก
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}