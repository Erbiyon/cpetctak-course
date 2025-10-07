"use client"

import { useState, useEffect } from "react"
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
import AddDiplomaSubject from "./add-diploma-subject"
import EditDiplomaSubject from "./edit-diploma-subject"
import AlertDeleteDiplomaSubject from "./alert-delete-diploma-subject"
import AddDiplomaSubjectDetail from "./add-diploma-subject-detail"

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

export function DiplomaCourse() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)


    const fetchSubjects = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/diploma-subjects')
            const data = await response.json()
            if (data.success) {

                setSubjects(data.subjects)
            }
        } catch (error) {
            console.error('Error fetching diploma subjects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSubjects()
    }, [])

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</CardTitle>
                            <CardDescription>
                                รายวิชาหลักที่จะได้เรียนในหลักสูตร ({subjects.length} รายวิชา)
                            </CardDescription>
                        </div>
                        <AddDiplomaSubject onSubjectAdded={fetchSubjects} />
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
                                    <TableHead>หน่วยกิต</TableHead>
                                    <TableHead>สถานะรายละเอียด</TableHead>
                                    <TableHead className="text-center w-0.5">ปุ่มดำเนินการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (

                                    Array.from({ length: 3 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : subjects.length === 0 ? (

                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            ยังไม่มีรายวิชาในระบบ กรุณาเพิ่มรายวิชาใหม่
                                        </TableCell>
                                    </TableRow>
                                ) : (

                                    subjects.map((subject, index) => {

                                        const isNewGroup = index === 0 || subjects[index - 1].groupName !== subject.groupName

                                        return (
                                            <TableRow
                                                key={subject.id}
                                                className={isNewGroup ? "border-t-2 border-t-muted" : ""}
                                            >
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            subject.groupName === 'พื้นฐานวิชาชีพ' ? 'default' :
                                                                subject.groupName === 'ชีพบังคับ' ? 'destructive' :
                                                                    subject.groupName === 'ชีพเลือก' ? 'secondary' : 'outline'
                                                        }
                                                    >
                                                        {subject.groupName || 'ไม่ระบุ'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{subject.code}</TableCell>
                                                <TableCell>{subject.title}</TableCell>
                                                <TableCell>
                                                    {subject.prereqs.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {subject.prereqs.map((prereq, index) => (
                                                                <span key={index} className="text-sm text-muted-foreground">
                                                                    {prereq.prereq.code}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {subject.credits}
                                                    {subject.detail && (
                                                        subject.detail.theoryHours !== null ||
                                                        subject.detail.practicalHours !== null ||
                                                        subject.detail.selfStudyHours !== null
                                                    ) ? (
                                                        <span className="text-muted-foreground">
                                                            ({subject.detail.theoryHours || 0}-{subject.detail.practicalHours || 0}-{subject.detail.selfStudyHours || 0})
                                                        </span>
                                                    ) : null}
                                                </TableCell>
                                                <TableCell>
                                                    {subject.detail ? (
                                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                            มีรายละเอียด
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                                                            ยังไม่มีรายละเอียด
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    <EditDiplomaSubject subject={subject} onSubjectUpdated={fetchSubjects} />
                                                    <AddDiplomaSubjectDetail
                                                        subjectId={subject.id}
                                                        onDetailAdded={fetchSubjects}
                                                        hasDetail={!!subject.detail}
                                                        subjectDetail={subject.detail}
                                                    />
                                                    <AlertDeleteDiplomaSubject
                                                        subject={subject}
                                                        onSubjectDeleted={fetchSubjects}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}