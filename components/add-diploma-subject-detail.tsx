"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
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
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SubjectDetailFormData {
    theoryHours: string
    practicalHours: string
    selfStudyHours: string
    englishTitle: string
    originalCode: string
    originalTitle: string
    description: string
}

interface AddDiplomaSubjectDetailProps {
    subjectId?: number
    onDetailAdded?: () => void
    hasDetail?: boolean
    subjectDetail?: {
        id: number
        theoryHours: number | null
        practicalHours: number | null
        selfStudyHours: number | null
        englishTitle: string | null
        originalCode: string | null
        originalTitle: string | null
        description: string | null
    }
}

export default function AddDiplomaSubjectDetail({ subjectId, onDetailAdded, hasDetail, subjectDetail }: AddDiplomaSubjectDetailProps) {
    const [formData, setFormData] = useState<SubjectDetailFormData>({
        theoryHours: "",
        practicalHours: "",
        selfStudyHours: "",
        englishTitle: "",
        originalCode: "",
        originalTitle: "",
        description: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    // โหลดข้อมูลเดิมเมื่อเปิด dialog
    useEffect(() => {
        if (isOpen && subjectDetail) {
            setFormData({
                theoryHours: subjectDetail.theoryHours?.toString() || "",
                practicalHours: subjectDetail.practicalHours?.toString() || "",
                selfStudyHours: subjectDetail.selfStudyHours?.toString() || "",
                englishTitle: subjectDetail.englishTitle || "",
                originalCode: subjectDetail.originalCode || "",
                originalTitle: subjectDetail.originalTitle || "",
                description: subjectDetail.description || ""
            })
            setIsEditMode(hasDetail || false)
        } else if (isOpen && !hasDetail) {
            // ถ้าไม่มีข้อมูลเดิม ให้เคลียร์ฟอร์ม
            setFormData({
                theoryHours: "",
                practicalHours: "",
                selfStudyHours: "",
                englishTitle: "",
                originalCode: "",
                originalTitle: "",
                description: ""
            })
            setIsEditMode(false)
        }
    }, [isOpen, subjectDetail, hasDetail])

    const handleInputChange = (field: keyof SubjectDetailFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        if (!subjectId) {
            toast.error('ไม่พบข้อมูลรายวิชา')
            return
        }

        setIsLoading(true)
        try {
            const url = hasDetail ? `/api/diploma-subject-details/${subjectDetail?.id}` : '/api/diploma-subject-details'
            const method = hasDetail ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subjectId,
                    theoryHours: formData.theoryHours ? parseInt(formData.theoryHours) : null,
                    practicalHours: formData.practicalHours ? parseInt(formData.practicalHours) : null,
                    selfStudyHours: formData.selfStudyHours ? parseInt(formData.selfStudyHours) : null,
                    englishTitle: formData.englishTitle || null,
                    originalCode: formData.originalCode || null,
                    originalTitle: formData.originalTitle || null,
                    description: formData.description || null,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success(hasDetail ? 'แก้ไขรายละเอียดรายวิชาเรียบร้อยแล้ว' : 'เพิ่มรายละเอียดรายวิชาเรียบร้อยแล้ว')
                setIsOpen(false)
                setIsEditMode(false)
                if (onDetailAdded) {
                    onDetailAdded()
                }
            } else {
                toast.error(result.error || 'เกิดข้อผิดพลาด')
            }
        } catch (error) {
            toast.error('ไม่สามารถบันทึกรายละเอียดรายวิชาได้')
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    title={hasDetail ? "ดู/แก้ไขรายละเอียดรายวิชา" : "เพิ่มรายละเอียดรายวิชา"}
                >
                    <Eye className={hasDetail ? "text-green-500" : "text-blue-400"} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {hasDetail ? (isEditMode ? "แก้ไขรายละเอียดรายวิชา" : "รายละเอียดรายวิชา") : "เพิ่มรายละเอียดรายวิชา"}
                    </DialogTitle>
                    <DialogDescription>
                        {hasDetail
                            ? (isEditMode ? "แก้ไขข้อมูลรายละเอียดของรายวิชาในหลักสูตร ปวส." : "ดูข้อมูลรายละเอียดของรายวิชาในหลักสูตร ปวส.")
                            : "เพิ่มข้อมูลรายละเอียดของรายวิชาในหลักสูตร ปวส."
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 my-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="theory-hours">ชั่วโมงทฤษฎี</Label>
                            <Input
                                type="number"
                                id="theory-hours"
                                placeholder="กรอกชั่วโมงทฤษฎี"
                                className="w-full"
                                value={formData.theoryHours}
                                onChange={(e) => handleInputChange('theoryHours', e.target.value)}
                                readOnly={hasDetail && !isEditMode}
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="practical-hours">ชั่วโมงปฏิบัติ</Label>
                            <Input
                                type="number"
                                id="practical-hours"
                                placeholder="กรอกชั่วโมงปฏิบัติ"
                                className="w-full"
                                value={formData.practicalHours}
                                onChange={(e) => handleInputChange('practicalHours', e.target.value)}
                                readOnly={hasDetail && !isEditMode}
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="self-study-hours">นอกเวลาเรียน</Label>
                            <Input
                                type="number"
                                id="self-study-hours"
                                placeholder="กรอกนอกเวลาเรียน"
                                className="w-full"
                                value={formData.selfStudyHours}
                                onChange={(e) => handleInputChange('selfStudyHours', e.target.value)}
                                readOnly={hasDetail && !isEditMode}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="english-title">ชื่อวิชาภาษาอังกฤษ</Label>
                        <Input
                            type="text"
                            id="english-title"
                            placeholder="กรอกชื่อวิชาภาษาอังกฤษ"
                            className="w-full"
                            value={formData.englishTitle}
                            onChange={(e) => handleInputChange('englishTitle', e.target.value)}
                            readOnly={hasDetail && !isEditMode}
                        />
                    </div>
                    <div className="flex gap-4 items-end">
                        <div className="flex flex-col gap-2 flex-1/3">
                            <Label htmlFor="original-code">รหัสรายวิชาเดิม</Label>
                            <Input
                                type="text"
                                id="original-code"
                                placeholder="กรอกรหัสรายวิชาเดิม"
                                className="w-full"
                                value={formData.originalCode}
                                onChange={(e) => handleInputChange('originalCode', e.target.value)}
                                readOnly={hasDetail && !isEditMode}
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1/3">
                            <Label htmlFor="original-title">ชื่อรายวิชาเดิม</Label>
                            <Input
                                type="text"
                                id="original-title"
                                placeholder="กรอกชื่อรายวิชาเดิม"
                                className="w-full"
                                value={formData.originalTitle}
                                onChange={(e) => handleInputChange('originalTitle', e.target.value)}
                                readOnly={hasDetail && !isEditMode}
                            />
                        </div>
                    </div>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="description">รายละเอียดรายวิชา</Label>
                        <Textarea
                            placeholder="กรอกรายละเอียดรายวิชา"
                            id="description"
                            className="h-24 sm:h-32 md:h-40"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            readOnly={hasDetail && !isEditMode}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            {hasDetail && !isEditMode ? "ปิด" : "ยกเลิก"}
                        </Button>
                    </DialogClose>
                    {hasDetail && !isEditMode ? (
                        <Button
                            variant="default"
                            onClick={() => setIsEditMode(true)}
                        >
                            แก้ไข
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            onClick={handleSubmit}
                            disabled={isLoading || !subjectId}
                        >
                            {isLoading ? "กำลังบันทึก..." : (hasDetail ? "บันทึกการแก้ไข" : "บันทึกข้อมูล")}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}