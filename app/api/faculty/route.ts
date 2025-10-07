import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const faculties = await prisma.faculty.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(faculties)
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบุคลากร:', error)
        return NextResponse.json(
            { error: 'ไม่สามารถดึงข้อมูลบุคลากรได้' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { firstName, lastName, imageUrl } = body

        if (!firstName || !lastName) {
            return NextResponse.json(
                { error: 'ชื่อและนามสกุลเป็นข้อมูลที่จำเป็น' },
                { status: 400 }
            )
        }

        const faculty = await prisma.faculty.create({
            data: {
                firstName,
                lastName,
                imageUrl: imageUrl || null
            }
        })

        return NextResponse.json(faculty, { status: 201 })
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างบุคลากร:', error)
        return NextResponse.json(
            { error: 'ไม่สามารถสร้างบุคลากรได้' },
            { status: 500 }
        )
    }
}