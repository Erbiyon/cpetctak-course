import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const faculties = await prisma.faculty.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true
            },
            orderBy: [
                { lastName: 'asc' }
            ]
        })

        return NextResponse.json(faculties)
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคณะสาธารณะ:', error)
        return NextResponse.json(
            { error: 'ไม่สามารถดึงข้อมูลคณะสาธารณะได้' },
            { status: 500 }
        )
    }
}