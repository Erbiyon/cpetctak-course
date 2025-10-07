import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access, constants } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'ไม่พบไฟล์ที่ต้องการอัปโหลด' },
                { status: 400 }
            );
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)' },
                { status: 400 }
            );
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'activity-blogs');

        try {
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true, mode: 0o755 });
                console.log(`Created uploads directory: ${uploadsDir}`);
            }

            await access(uploadsDir, constants.W_OK);
        } catch (dirError) {
            console.error('Directory creation/permission error:', dirError);
            return NextResponse.json(
                { error: 'ไม่สามารถสร้างโฟลเดอร์สำหรับอัปโหลดได้ กรุณาตรวจสอบสิทธิ์การเขียนไฟล์' },
                { status: 500 }
            );
        }

        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filepath = join(uploadsDir, filename);

        try {
            await writeFile(filepath, buffer, { mode: 0o644 });
            console.log(`บันทึกไฟล์สำเร็จแล้ว: ${filepath}`);
        } catch (writeError) {
            console.error('เกิดข้อผิดพลาดในการบันทึกไฟล์:', writeError);
            return NextResponse.json(
                { error: 'ไม่สามารถบันทึกไฟล์ได้ กรุณาตรวจสอบพื้นที่ดิสก์และสิทธิ์การเขียนไฟล์' },
                { status: 500 }
            );
        }

        const imageUrl = `/api/images/activity-blogs/${filename}`;

        console.log(`อัปโหลดรูปภาพสำเร็จ: ${filename}`);

        return NextResponse.json({
            url: imageUrl,
            filename,
            originalName: file.name,
            size: file.size,
            message: 'อัปโหลดไฟล์สำเร็จ'
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์:', error);
        return NextResponse.json(
            {
                error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}