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
import { FilePlus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";
import { toast } from "sonner";

interface AddActivityCourseProps {
    onActivityAdded?: () => void;
}

export default function AddActivityCourse({ onActivityAdded }: AddActivityCourseProps) {
    const [title, setTitle] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('กรุณากรอกชื่อกิจกรรม');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    isPublished,
                }),
            });

            if (response.ok) {
                toast.success('บันทึกกิจกรรมเรียบร้อยแล้ว');
                setTitle('');
                setIsPublished(false);
                setIsOpen(false);
                // Call callback if provided
                if (onActivityAdded) {
                    onActivityAdded();
                }
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error saving activity:', error);
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>
                    <FilePlus className="mr-2" />
                    เพิ่มกิจกรรม
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>เพิ่มกิจกรรม</DialogTitle>
                        <DialogDescription>
                            เพิ่มกิจกรรมใหม่ที่เกี่ยวข้องกับหลักสูตร
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 my-4">
                        <Label htmlFor="activity-title">ชื่อกิจกรรม</Label>
                        <Input
                            type="text"
                            id="activity-title"
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
                                    {new Date().toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="status-published"
                                        checked={isPublished}
                                        onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                                    />
                                    <Label htmlFor="status-published">เผยแพร่</Label>
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
                                    setTitle('');
                                    setIsPublished(false);
                                }}
                            >
                                ยกเลิก
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}