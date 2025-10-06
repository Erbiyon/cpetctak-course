"use client"

import { useRef } from "react"
import { AddFaculty } from "@/components/add-faculty-dialog"
import { FacultyList, FacultyListRef } from "@/components/faculty-list"

export function FacultyManagement() {
    const facultyListRef = useRef<FacultyListRef>(null)

    const handleFacultyAdded = () => {
        if (facultyListRef.current) {
            facultyListRef.current.refresh()
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">รายการบุคลากร</h3>
                    <p className="text-sm text-muted-foreground">
                        จัดการข้อมูลบุคลากรของหลักสูตร
                    </p>
                </div>
                <AddFaculty onFacultyAdded={handleFacultyAdded} />
            </div>

            <FacultyList ref={facultyListRef} />
        </div>
    )
}
