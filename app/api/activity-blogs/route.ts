import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { activityId, title, content, isPublished } = body;

        if (!activityId || !title || !content) {
            return NextResponse.json(
                { error: 'ข้อมูลไม่ครบถ้วน' },
                { status: 400 }
            );
        }

        // Check if activity exists
        const activity = await prisma.activity.findUnique({
            where: { id: parseInt(activityId) },
            include: {
                blogs: true,
            },
        });

        if (!activity) {
            return NextResponse.json(
                { error: 'ไม่พบกิจกรรมที่ระบุ' },
                { status: 404 }
            );
        }

        // Check if activity already has a blog
        if (activity.blogs.length > 0) {
            return NextResponse.json(
                { error: 'กิจกรรมนี้มีบล็อกอยู่แล้ว กรุณาใช้การแก้ไข' },
                { status: 400 }
            );
        }

        const activityBlog = await prisma.activityBlog.create({
            data: {
                activityId: parseInt(activityId),
                title,
                content,
                isPublished: isPublished || false,
            },
        });

        return NextResponse.json(activityBlog, { status: 201 });
    } catch (error) {
        console.error('Error creating activity blog:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการสร้างบล็อก' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get('activityId');

        let where = {};
        if (activityId) {
            where = { activityId: parseInt(activityId) };
        }

        const activityBlogs = await prisma.activityBlog.findMany({
            where,
            include: {
                activity: true,
                images: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(activityBlogs);
    } catch (error) {
        console.error('Error fetching activity blogs:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลบล็อก' },
            { status: 500 }
        );
    }
}