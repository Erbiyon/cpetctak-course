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
                courseType: 'bachelor'
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

        // จัดเรียงตามลำดับกลุ่มวิชาที่ต้องการ
        const groupOrder = {
            '': 0, // ไม่เลือกจะแสดงข้างบน
            'พื้นฐานวิชาชีพ': 1,
            'ชีพบังคับ': 2,
            'ชีพเลือก': 3
        }

        interface SubjectSort {
            groupName: string;
            code: string;
        }

        const sortedSubjects = subjects.sort((a: SubjectSort, b: SubjectSort) => {
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
        console.error('Error fetching public subjects:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch subjects' },
            { status: 500 }
        )
    }
}
