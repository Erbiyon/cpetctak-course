import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Subject, SubjectDetail, SubjectPrereq } from '@prisma/client'

type SubjectWithDetails = Subject & {
    prereqs: (SubjectPrereq & {
        prereq: Subject
    })[]
    detail: SubjectDetail | null
}

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                courseType: 'diploma'
            },
            include: {
                prereqs: {
                    include: {
                        prereq: true
                    }
                },
                detail: true
            },
            orderBy: [
                {
                    groupName: 'asc'
                },
                {
                    code: 'asc'
                }
            ]
        })

        // จัดเรียงตามลำดับกลุ่มวิชาที่ต้องการ (สำหรับ ปวส.)
        const groupOrder = {
            '': 0, // ไม่เลือกจะแสดงข้างบน
            'พื้นฐานวิชาชีพ': 1,
            'ชีพบังคับ': 2,
            'ชีพเลือก': 3
        }

        const sortedSubjects = subjects.sort((a: SubjectWithDetails, b: SubjectWithDetails) => {
            const aGroupOrder = groupOrder[a.groupName as keyof typeof groupOrder] || 999
            const bGroupOrder = groupOrder[b.groupName as keyof typeof groupOrder] || 999

            // เรียงตามกลุ่มวิชาก่อน
            if (aGroupOrder !== bGroupOrder) {
                return aGroupOrder - bGroupOrder
            }

            // ถ้ากลุ่มวิชาเหมือนกัน จึงเรียงตามรหัสวิชา
            return a.code.localeCompare(b.code)
        })

        return NextResponse.json({ success: true, subjects: sortedSubjects })
    } catch (error) {
        console.error('Error fetching diploma subjects:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถดึงข้อมูลรายวิชาได้' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { groupName, code, title, credits, prerequisites } = body

        // ตรวจสอบว่ารหัสวิชาซ้ำหรือไม่
        const existingSubject = await prisma.subject.findUnique({
            where: { code }
        })

        if (existingSubject) {
            return NextResponse.json(
                { success: false, error: 'รหัสวิชานี้มีอยู่แล้วในระบบ' },
                { status: 400 }
            )
        }

        // สร้างรายวิชาใหม่
        const subject = await prisma.subject.create({
            data: {
                courseType: 'diploma',
                groupName,
                code,
                title,
                credits: parseInt(credits),
            },
        })

        // เพิ่มข้อมูลวิชาบังคับก่อน (ถ้ามี)
        if (prerequisites && prerequisites.length > 0) {
            const prereqCodes = prerequisites.filter((prereq: string) => prereq.trim() !== '')

            if (prereqCodes.length > 0) {
                // หาวิชาบังคับก่อนที่มีอยู่ในฐานข้อมูล (เฉพาะ diploma course)
                const existingPrereqs = await prisma.subject.findMany({
                    where: {
                        courseType: 'diploma',
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
            message: 'เพิ่มรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('Error creating diploma subject:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถเพิ่มรายวิชาได้' },
            { status: 500 }
        )
    }
}