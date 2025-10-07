import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Subject, SubjectDetail, SubjectPrereq } from '@prisma/client'

type SubjectWithDetails = Subject & {
    prereqs: (SubjectPrereq & {
        prereq: Subject
    })[]
    detail: SubjectDetail | null
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'bachelor'

        const subjects = await prisma.subject.findMany({
            where: {
                courseType: type
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

        const groupOrder = {
            '': 0,
            'พื้นฐานวิชาชีพ': 1,
            'ชีพบังคับ': 2,
            'ชีพเลือก': 3
        }

        const sortedSubjects = subjects.sort((a: SubjectWithDetails, b: SubjectWithDetails) => {
            const aGroupOrder = groupOrder[a.groupName as keyof typeof groupOrder] || 999
            const bGroupOrder = groupOrder[b.groupName as keyof typeof groupOrder] || 999

            if (aGroupOrder !== bGroupOrder) {
                return aGroupOrder - bGroupOrder
            }

            return a.code.localeCompare(b.code)
        })

        return NextResponse.json({ success: true, subjects: sortedSubjects })
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรายวิชา:', error)
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

        const existingSubject = await prisma.subject.findUnique({
            where: { code }
        })

        if (existingSubject) {
            return NextResponse.json(
                { success: false, error: 'รหัสวิชานี้มีอยู่แล้วในระบบ' },
                { status: 400 }
            )
        }

        const subject = await prisma.subject.create({
            data: {
                courseType: 'bachelor',
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
                        courseType: 'bachelor',
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
            message: 'เพิ่มรายวิชาสำเร็จ'
        })

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างรายวิชา:', error)
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถเพิ่มรายวิชาได้' },
            { status: 500 }
        )
    }
}