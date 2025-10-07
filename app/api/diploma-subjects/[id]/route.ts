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

        await prisma.subjectPrereq.deleteMany({
            where: { subjectId: id }
        })

        const subject = await prisma.subject.update({
            where: { id },
            data: {
                groupName,
                code,
                title,
                credits: parseInt(credits),
            },
        })

        if (prerequisites && prerequisites.length > 0) {
            const prereqCodes = prerequisites.filter((prereq: string) => prereq.trim() !== '')

            if (prereqCodes.length > 0) {
                const existingPrereqs = await prisma.subject.findMany({
                    where: {
                        code: {
                            in: prereqCodes
                        }
                    }
                })

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
        console.error('เกิดข้อผิดพลาดในการอัปเดตรายวิชาประกาศนียบัตร:', error)
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

        await prisma.subjectPrereq.deleteMany({
            where: {
                OR: [
                    { subjectId: id },
                    { prereqId: id }
                ]
            }
        })

        await prisma.subject.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'ลบรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบรายวิชาประกาศนียบัตร:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถลบรายวิชาได้' },
            { status: 500 }
        )
    }
}