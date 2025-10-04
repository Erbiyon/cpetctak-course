import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            subjectId,
            theoryHours,
            practicalHours,
            selfStudyHours,
            englishTitle,
            originalCode,
            originalTitle,
            description
        } = body

        // ตรวจสอบว่ารายวิชามีอยู่หรือไม่
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        })

        if (!subject) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบรายวิชา' },
                { status: 404 }
            )
        }

        // ตรวจสอบว่ามีรายละเอียดอยู่แล้วหรือไม่
        const existingDetail = await prisma.subjectDetail.findUnique({
            where: { subjectId }
        })

        if (existingDetail) {
            return NextResponse.json(
                { success: false, error: 'รายวิชานี้มีรายละเอียดอยู่แล้ว' },
                { status: 400 }
            )
        }

        // สร้างรายละเอียดรายวิชาใหม่
        const subjectDetail = await prisma.subjectDetail.create({
            data: {
                subjectId,
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
            message: 'เพิ่มรายละเอียดรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error creating diploma subject detail:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถเพิ่มรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const subjectDetails = await prisma.subjectDetail.findMany({
            include: {
                subject: true
            },
            orderBy: {
                subject: {
                    code: 'asc'
                }
            }
        })

        return NextResponse.json({ success: true, subjectDetails })
    } catch (error) {
        console.error('Error fetching diploma subject details:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถดึงข้อมูลรายละเอียดรายวิชาได้' },
            { status: 500 }
        )
    }
}