import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const subjectDetail = await prisma.subjectDetail.findUnique({
            where: { id: parseInt(id) },
            include: {
                subject: true
            }
        })

        if (!subjectDetail) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบรายละเอียดรายวิชา' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, subjectDetail })
    } catch (error) {
        console.error('Error fetching diploma subject detail:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถดึงข้อมูลรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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
            where: { id: parseInt(id) }
        })

        if (!existingDetail) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบรายละเอียดรายวิชา' },
                { status: 404 }
            )
        }

        // อัปเดตรายละเอียดรายวิชา
        const updatedDetail = await prisma.subjectDetail.update({
            where: { id: parseInt(id) },
            data: {
                theoryHours,
                practicalHours,
                selfStudyHours,
                englishTitle,
                originalCode,
                originalTitle,
                description,
            },
            include: {
                subject: true
            }
        })

        return NextResponse.json({
            success: true,
            subjectDetail: updatedDetail,
            message: 'อัปเดตรายละเอียดรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error updating diploma subject detail:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถอัปเดตรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // ตรวจสอบว่ารายละเอียดมีอยู่หรือไม่
        const existingDetail = await prisma.subjectDetail.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingDetail) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบรายละเอียดรายวิชา' },
                { status: 404 }
            )
        }

        // ลบรายละเอียดรายวิชา
        await prisma.subjectDetail.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'ลบรายละเอียดรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error deleting diploma subject detail:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถลบรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}