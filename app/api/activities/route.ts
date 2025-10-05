import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, isPublished } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'ชื่อกิจกรรมเป็นข้อมูลที่จำเป็น' },
                { status: 400 }
            );
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                isPublished: isPublished || false,
            },
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการสร้างกิจกรรม' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' },
            { status: 500 }
        );
    }
}