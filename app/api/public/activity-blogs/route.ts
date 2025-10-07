import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const publishedBlogs = await prisma.activityBlog.findMany({
            where: {
                isPublished: true,
            },
            include: {
                activity: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(publishedBlogs);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบล็อกกิจกรรม:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' },
            { status: 500 }
        );
    }
}