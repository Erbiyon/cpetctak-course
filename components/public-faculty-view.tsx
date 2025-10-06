"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserRound } from "lucide-react"

interface FacultyMember {
    id: number
    firstName: string
    lastName: string
    imageUrl?: string
    createdAt: string
    updatedAt: string
}

export function PublicFacultyView() {
    const [faculties, setFaculties] = useState<FacultyMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFaculties()
    }, [])

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
                        <UserRound className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">ยังไม่มีบุคลากรในระบบ</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {faculties.map((faculty) => (
                <Card key={faculty.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
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
    )
}