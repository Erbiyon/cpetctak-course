import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const bachelorCount = await prisma.subject.count({
            where: {
                courseType: 'bachelor'
            }
        })

        const diplomaCount = await prisma.subject.count({
            where: {
                courseType: 'diploma'
            }
        })

        const activitiesCount = await prisma.activity.count()

        const blogsCount = await prisma.activityBlog.count({
            where: {
                isPublished: true
            }
        })

        return NextResponse.json({
            bachelorSubjects: bachelorCount,
            diplomaSubjects: diplomaCount,
            activities: activitiesCount,
            publishedBlogs: blogsCount
        })
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถานะ:', error)
        return NextResponse.json(
            { error: 'ไม่สามารถดึงข้อมูลสถานะได้' },
            { status: 500 }
        )
    }
}