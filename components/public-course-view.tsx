"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Subject {
    id: number
    code: string
    title: string
    groupName: string
    credits: number
    prereqs: {
        prereq: {
            code: string
            title: string
        }
    }[]
    detail?: {
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

interface PublicBachelorCourseProps {
    courseType: 'bachelor' | 'diploma'
}

export function PublicCourseView({ courseType }: PublicBachelorCourseProps) {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)


    const fetchSubjects = useCallback(async () => {
        try {
            setIsLoading(true)
            const apiEndpoint = courseType === 'bachelor'
                ? '/api/public/subjects'
                : '/api/public/diploma-subjects'
            const response = await fetch(apiEndpoint)
            const data = await response.json()
            if (data.success) {
                setSubjects(data.subjects)
            }
        } catch (error) {
            console.error('Error fetching subjects:', error)
        } finally {
            setIsLoading(false)
        }
    }, [courseType])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    const getGroupColor = (groupName: string) => {
        switch (groupName) {
            case 'พื้นฐานวิชาชีพ':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            case 'ชีพบังคับ':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'ชีพเลือก':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }
    }

    const courseTitle = courseType === 'bachelor'
        ? 'หลักสูตรวิศวกรรมคอมพิวเตอร์ (ป.ตรี)'
        : 'หลักสูตรเทคโนโลยีคอมพิวเตอร์ (ปวส.)'

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>{courseTitle}</CardTitle>
                    <CardDescription>
                        รายวิชาหลักที่จะได้เรียนในหลักสูตร ({subjects.length} รายวิชา)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>กลุ่มวิชา</TableHead>
                                <TableHead>รหัสวิชา</TableHead>
                                <TableHead>ชื่อวิชา</TableHead>
                                <TableHead>วิชาบังคับก่อน</TableHead>
                                <TableHead className="text-center">หน่วยกิต</TableHead>
                                <TableHead className="text-center">รายละเอียด</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (

                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    </TableRow>
                                ))
                            ) : subjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        ไม่พบข้อมูลรายวิชา
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subjects.map((subject) => (
                                    <TableRow key={subject.id}>
                                        <TableCell>
                                            {subject.groupName ? (
                                                <Badge variant="outline" className={getGroupColor(subject.groupName)}>
                                                    {subject.groupName}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-100 text-gray-500">
                                                    ไม่ระบุ
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {subject.code}
                                        </TableCell>
                                        <TableCell>
                                            {subject.title}
                                        </TableCell>
                                        <TableCell>
                                            {subject.prereqs.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {subject.prereqs.map((prereq, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {prereq.prereq.code}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">
                                                {subject.credits}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {subject.detail ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                {subject.code} - {subject.title}
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                รายละเอียดรายวิชา
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">กลุ่มวิชา</p>
                                                                    <p>{subject.groupName || '-'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">หน่วยกิต</p>
                                                                    <p>{subject.credits}</p>
                                                                </div>
                                                            </div>

                                                            {subject.detail.englishTitle && (
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">ชื่อวิชาภาษาอังกฤษ</p>
                                                                    <p>{subject.detail.englishTitle}</p>
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-3 gap-4">
                                                                {subject.detail.theoryHours !== null && (
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500">ชั่วโมงทฤษฎี</p>
                                                                        <p>{subject.detail.theoryHours} ชั่วโมง</p>
                                                                    </div>
                                                                )}
                                                                {subject.detail.practicalHours !== null && (
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500">ชั่วโมงปฏิบัติ</p>
                                                                        <p>{subject.detail.practicalHours} ชั่วโมง</p>
                                                                    </div>
                                                                )}
                                                                {subject.detail.selfStudyHours !== null && (
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500">ชั่วโมงศึกษาด้วยตนเอง</p>
                                                                        <p>{subject.detail.selfStudyHours} ชั่วโมง</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {subject.detail.description && (
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">รายละเอียดรายวิชา</p>
                                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{subject.detail.description}</p>
                                                                </div>
                                                            )}

                                                            {subject.prereqs.length > 0 && (
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">วิชาบังคับก่อน</p>
                                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                                        {subject.prereqs.map((prereq, index) => (
                                                                            <Badge key={index} variant="secondary">
                                                                                {prereq.prereq.code} - {prereq.prereq.title}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
