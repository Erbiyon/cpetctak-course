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
        const { groupName, code, title, credits, prerequisites } = body

        // ตรวจสอบว่ารหัสวิชาซ้ำหรือไม่ (ยกเว้นตัวเอง)
        const existingSubject = await prisma.subject.findFirst({
            where: {
                code,
                NOT: { id }
            }
        })

        if (existingSubject) {
            return NextResponse.json(
                { success: false, error: 'รหัสวิชานี้มีอยู่แล้วในระบบ' },
                { status: 400 }
            )
        }

        // ลบวิชาบังคับก่อนเดิมทั้งหมด
        await prisma.subjectPrereq.deleteMany({
            where: { subjectId: id }
        })

        // อัพเดตข้อมูลรายวิชา
        const subject = await prisma.subject.update({
            where: { id },
            data: {
                groupName,
                code,
                title,
                credits: parseInt(credits),
            },
        })

        // เพิ่มข้อมูลวิชาบังคับก่อนใหม่ (ถ้ามี)
        if (prerequisites && prerequisites.length > 0) {
            const prereqCodes = prerequisites.filter((prereq: string) => prereq.trim() !== '')

            if (prereqCodes.length > 0) {
                // หาวิชาบังคับก่อนที่มีอยู่ในฐานข้อมูล
                const existingPrereqs = await prisma.subject.findMany({
                    where: {
                        code: {
                            in: prereqCodes
                        }
                    }
                })

                // สร้างความสัมพันธ์วิชาบังคับก่อน
                const prereqRelations = existingPrereqs.map(prereq => ({
                    subjectId: subject.id,
                    prereqId: prereq.id,
                }))

                if (prereqRelations.length > 0) {
                    await prisma.subjectPrereq.createMany({
                        data: prereqRelations,
                    })
                }
            }
        }

        return NextResponse.json({
            success: true,
            subject,
            message: 'แก้ไขรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error updating diploma subject:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถแก้ไขรายวิชาได้' },
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

        // ลบวิชาบังคับก่อนที่เกี่ยวข้อง
        await prisma.subjectPrereq.deleteMany({
            where: {
                OR: [
                    { subjectId: id },
                    { prereqId: id }
                ]
            }
        })

        // ลบรายวิชา
        await prisma.subject.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'ลบรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error deleting diploma subject:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถลบรายวิชาได้' },
            { status: 500 }
        )
    }
}