import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const activityBlogId = formData.get('activityBlogId') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'ไม่พบไฟล์ที่ต้องการอัปโหลด' },
                { status: 400 }
            );
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)' },
                { status: 400 }
            );
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'activity-blogs');
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filepath = join(uploadsDir, filename);

        // Write file to disk
        await writeFile(filepath, buffer);

        // Save image info to database
        const imageUrl = `/uploads/activity-blogs/${filename}`;

        let savedImage = null;
        if (activityBlogId && activityBlogId !== 'null') {
            savedImage = await prisma.activityImage.create({
                data: {
                    activityBlogId: parseInt(activityBlogId),
                    filename,
                    originalName: file.name,
                    mimetype: file.type,
                    size: file.size,
                    url: imageUrl,
                },
            });
        }

        return NextResponse.json({
            url: imageUrl,
            filename,
            originalName: file.name,
            size: file.size,
            id: savedImage?.id || null,
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
            { status: 500 }
        );
    }
}