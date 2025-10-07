import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

        const groupOrder = {
            '': 0,
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

            if (aGroupOrder !== bGroupOrder) {
                return aGroupOrder - bGroupOrder
            }

            return a.code.localeCompare(b.code)
        })

        return NextResponse.json({ success: true, subjects: sortedSubjects })
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลวิชาหลักสูตรประกาศนียบัตร:', error)
        return NextResponse.json(
            { success: false, message: 'ไม่สามารถรับวิชาประกาศนียบัตรได้' },
            { status: 500 }
        )
    }
}