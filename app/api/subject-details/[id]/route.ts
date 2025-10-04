import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)
        const body = await request.json()
        const {
            theoryHours,
            practicalHours,
            selfStudyHours,
            englishTitle,
            originalCode,
            originalTitle,
            description
        } = body

        // ตรวจสอบว่ารายละเอียดมีอยู่หรือไม่
        const existingDetail = await prisma.subjectDetail.findUnique({
            where: { id }
        })

        if (!existingDetail) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบรายละเอียดรายวิชา' },
                { status: 404 }
            )
        }

        // อัปเดตรายละเอียดรายวิชา
        const subjectDetail = await prisma.subjectDetail.update({
            where: { id },
            data: {
                theoryHours,
                practicalHours,
                selfStudyHours,
                englishTitle,
                originalCode,
                originalTitle,
                description,
            },
        })

        return NextResponse.json({
            success: true,
            subjectDetail,
            message: 'แก้ไขรายละเอียดรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error updating subject detail:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถแก้ไขรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)

        // ลบรายละเอียดรายวิชา
        await prisma.subjectDetail.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'ลบรายละเอียดรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error deleting subject detail:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถลบรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}