"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

interface Subject {
    id: number
    code: string
    title: string
    groupName: string
    credits: number
}

interface AlertDeleteBachelorSubjectProps {
    subject?: Subject
    onSubjectDeleted?: () => void
}

export default function AlertDeleteBachelorSubject({ subject, onSubjectDeleted }: AlertDeleteBachelorSubjectProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!subject) {
            toast.error('ไม่พบข้อมูลรายวิชา')
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/subjects/${subject.id}`, {
                method: 'DELETE',
            })

            const result = await response.json()

            if (result.success) {
                toast.success('ลบรายวิชาเรียบร้อยแล้ว')
                if (onSubjectDeleted) {
                    onSubjectDeleted()
                }
            } else {
                toast.error(result.error || 'เกิดข้อผิดพลาด')
            }
        } catch (error) {
            toast.error('ไม่สามารถลบรายวิชาได้')
            console.error('Error:', error)
        } finally {
            setIsDeleting(false)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                >
                    <Trash className="text-red-400" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">ยืนยันการลบรายวิชา</AlertDialogTitle>
                    <AlertDialogDescription>
                        คุณแน่ใจหรือไม่ที่จะลบรายวิชา <strong>{subject?.code} - {subject?.title}</strong> นี้?
                        <br /><br />
                        การดำเนินการนี้ไม่สามารถยกเลิกได้ และข้อมูลรายวิชาจะถูกลบออกจากระบบอย่างถาวร
                        รวมถึงรายละเอียดและความสัมพันธ์กับวิชาบังคับก่อนด้วย
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? "กำลังลบ..." : "ลบรายวิชา"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}