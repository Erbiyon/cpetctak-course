import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID ของบล็อกไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const blog = await prisma.activityBlog.findUnique({
            where: { id },
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
                { error: 'ไม่พบบล็อกที่ระบุ' },
                { status: 404 }
            );
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลบล็อก' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID ของบล็อกไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, content, isPublished } = body;

        // Check if blog exists
        const existingBlog = await prisma.activityBlog.findUnique({
            where: { id }
        });

        if (!existingBlog) {
            return NextResponse.json(
                { error: 'ไม่พบบล็อกที่ต้องการแก้ไข' },
                { status: 404 }
            );
        }

        // Build update data object
        const updateData: { title?: string; content?: string; isPublished?: boolean } = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (isPublished !== undefined) updateData.isPublished = isPublished;

        // Update the blog
        const updatedBlog = await prisma.activityBlog.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedBlog);
    } catch (error) {
        console.error('Error updating activity blog:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการแก้ไขบล็อก' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID ของบล็อกไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // Check if blog exists
        const existingBlog = await prisma.activityBlog.findUnique({
            where: { id }
        });

        if (!existingBlog) {
            return NextResponse.json(
                { error: 'ไม่พบบล็อกที่ต้องการลบ' },
                { status: 404 }
            );
        }

        // Delete the blog
        await prisma.activityBlog.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'ลบบล็อกเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Error deleting activity blog:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการลบบล็อก' },
            { status: 500 }
        );
    }
}