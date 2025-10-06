"use client"

import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EditFacultyDialog } from "@/components/edit-faculty-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, UserRound } from "lucide-react"
import { toast } from "sonner"

interface FacultyMember {
    id: number
    firstName: string
    lastName: string
    imageUrl?: string
    createdAt: string
    updatedAt: string
}

export interface FacultyListRef {
    refresh: () => void
}

export const FacultyList = forwardRef<FacultyListRef>((props, ref) => {
    const [faculties, setFaculties] = useState<FacultyMember[]>([])
    const [loading, setLoading] = useState(true)
    const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [facultyToDelete, setFacultyToDelete] = useState<FacultyMember | null>(null)

    useEffect(() => {
        fetchFaculties()
    }, [])

    useImperativeHandle(ref, () => ({
        refresh: fetchFaculties
    }))

    const fetchFaculties = async () => {
        try {
            const response = await fetch('/api/faculty')
            if (response.ok) {
                const data = await response.json()
                setFaculties(data)
            }
        } catch (error) {
            console.error('Error fetching faculties:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (faculty: FacultyMember) => {
        setFacultyToDelete(faculty)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!facultyToDelete) return

        try {
            const response = await fetch(`/api/faculty/${facultyToDelete.id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                fetchFaculties()
                setDeleteDialogOpen(false)
                setFacultyToDelete(null)

                toast.success('ลบบุคลากรเรียบร้อยแล้ว')
            } else {
                console.error('Failed to delete faculty')
            }
        } catch (error) {
            console.error('Error deleting faculty:', error)
        }
    }

    const handleEdit = (faculty: FacultyMember) => {
        setEditingFaculty(faculty)
        setEditDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 text-center">
                            <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                            <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                            <Skeleton className="h-3 w-1/2 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (faculties.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <span className="text-2xl"><UserRound /></span>
                    </div>
                    <p className="text-muted-foreground">ยังไม่มีบุคลากรในระบบ</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {faculties.map((faculty) => (
                    <Card key={faculty.id} className="hover:shadow-md transition-shadow relative">
                        <CardContent className="p-6 text-center">
                            <div className="absolute top-2 right-2 flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEdit(faculty)}
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(faculty)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <Avatar className="w-32 h-32 mx-auto mb-4">
                                <AvatarImage
                                    src={faculty.imageUrl || undefined}
                                    className="object-cover w-full h-full"
                                />
                                <AvatarFallback className="text-2xl font-semibold bg-muted">
                                    <UserRound className="w-16 h-16 text-muted-foreground" />
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="font-medium text-sm leading-tight">
                                {faculty.firstName} {faculty.lastName}
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <EditFacultyDialog
                faculty={editingFaculty}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onFacultyUpdated={fetchFaculties}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบบุคลากร "{facultyToDelete?.firstName} {facultyToDelete?.lastName}" หรือไม่?
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            ลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
})