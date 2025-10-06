import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const faculties = await prisma.faculty.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                imageUrl: true
                // ไม่ดึง createdAt, updatedAt เพื่อความปลอดภัย
            },
            orderBy: [
                { position: 'asc' }, // เรียงตามตำแหน่ง
                { lastName: 'asc' }   // แล้วเรียงตามนามสกุล
            ]
        })

        return NextResponse.json(faculties)
    } catch (error) {
        console.error('Error fetching public faculties:', error)
        return NextResponse.json(
            { error: 'Failed to fetch faculties' },
            { status: 500 }
        )
    }
}