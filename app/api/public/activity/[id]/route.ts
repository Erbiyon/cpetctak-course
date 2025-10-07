import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const activityId = parseInt(paramId);

        if (isNaN(activityId)) {
            return NextResponse.json(
                { error: 'ID ของกิจกรรมไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const blog = await prisma.activityBlog.findFirst({
            where: {
                activityId: activityId,
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
        });

        if (!blog) {
            return NextResponse.json(
                { error: 'ไม่พบกิจกรรมที่เผยแพร่' },
                { status: 404 }
            );
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' },
            { status: 500 }
        );
    }
}