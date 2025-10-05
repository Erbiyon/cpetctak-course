import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID ของกิจกรรมไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const activity = await prisma.activity.findUnique({
            where: { id }
        });

        if (!activity) {
            return NextResponse.json(
                { error: 'ไม่พบกิจกรรมที่ระบุ' },
                { status: 404 }
            );
        }

        return NextResponse.json(activity);
    } catch (error) {
        console.error('Error fetching activity:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID ของกิจกรรมไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'ชื่อกิจกรรมเป็นข้อมูลที่จำเป็น' },
                { status: 400 }
            );
        }

        // Check if activity exists
        const existingActivity = await prisma.activity.findUnique({
            where: { id }
        });

        if (!existingActivity) {
            return NextResponse.json(
                { error: 'ไม่พบกิจกรรมที่ต้องการแก้ไข' },
                { status: 404 }
            );
        }

        // Update the activity
        const updatedActivity = await prisma.activity.update({
            where: { id },
            data: {
                title,
            },
        });

        return NextResponse.json(updatedActivity);
    } catch (error) {
        console.error('Error updating activity:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการแก้ไขกิจกรรม' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID ของกิจกรรมไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // Check if activity exists
        const activity = await prisma.activity.findUnique({
            where: { id }
        });

        if (!activity) {
            return NextResponse.json(
                { error: 'ไม่พบกิจกรรมที่ต้องการลบ' },
                { status: 404 }
            );
        }

        // Delete the activity
        await prisma.activity.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'ลบกิจกรรมเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการลบกิจกรรม' },
            { status: 500 }
        );
    }
}