import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const facultyId = parseInt(id)

        if (isNaN(facultyId)) {
            return NextResponse.json(
                { error: 'Invalid faculty ID' },
                { status: 400 }
            )
        }

        // ตรวจสอบว่าบุคลากรมีอยู่หรือไม่
        const faculty = await prisma.faculty.findUnique({
            where: { id: facultyId }
        })

        if (!faculty) {
            return NextResponse.json(
                { error: 'ไม่พบบุคลากรที่ต้องการลบ' },
                { status: 404 }
            )
        }

        // ลบบุคลากร
        await prisma.faculty.delete({
            where: { id: facultyId }
        })

        return NextResponse.json({
            message: 'ลบบุคลากรสำเร็จ',
            deletedId: facultyId
        })
    } catch (error) {
        console.error('Error deleting faculty:', error)
        return NextResponse.json(
            { error: 'Failed to delete faculty' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const facultyId = parseInt(id)
        const body = await request.json()
        const { firstName, lastName, imageUrl } = body

        if (isNaN(facultyId)) {
            return NextResponse.json(
                { error: 'Invalid faculty ID' },
                { status: 400 }
            )
        }

        if (!firstName || !lastName) {
            return NextResponse.json(
                { error: 'ชื่อและนามสกุลเป็นข้อมูลที่จำเป็น' },
                { status: 400 }
            )
        }

        // ตรวจสอบว่าบุคลากรมีอยู่หรือไม่
        const existingFaculty = await prisma.faculty.findUnique({
            where: { id: facultyId }
        })

        if (!existingFaculty) {
            return NextResponse.json(
                { error: 'ไม่พบบุคลากรที่ต้องการแก้ไข' },
                { status: 404 }
            )
        }

        // อัพเดตบุคลากร
        const updatedFaculty = await prisma.faculty.update({
            where: { id: facultyId },
            data: {
                firstName,
                lastName,
                imageUrl: imageUrl || null
            }
        })

        return NextResponse.json(updatedFaculty)
    } catch (error) {
        console.error('Error updating faculty:', error)
        return NextResponse.json(
            { error: 'Failed to update faculty' },
            { status: 500 }
        )
    }
}