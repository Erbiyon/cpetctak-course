import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params
        const imagePath = path.join('/')

        if (imagePath.includes('..') || imagePath.includes('\\')) {
            return new NextResponse('ไม่สามารถเข้าถึงไฟล์นี้ได้', { status: 400 })
        }

        const filePath = join(process.cwd(), 'public', 'uploads', imagePath)

        if (!existsSync(filePath)) {
            console.log(`ไม่พบรูปภาพ: ${filePath}`)
            return new NextResponse('ไม่พบรูปภาพ', { status: 404 })
        }

        const stats = await stat(filePath)

        const fileBuffer = await readFile(filePath)

        const fileExtension = imagePath.split('.').pop()?.toLowerCase()
        let contentType = 'application/octet-stream'

        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg'
                break
            case 'png':
                contentType = 'image/png'
                break
            case 'gif':
                contentType = 'image/gif'
                break
            case 'webp':
                contentType = 'image/webp'
                break
            case 'svg':
                contentType = 'image/svg+xml'
                break
            default:
                contentType = 'application/octet-stream'
        }

        return new NextResponse(new Uint8Array(fileBuffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': stats.size.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Last-Modified': stats.mtime.toUTCString(),
                'ETag': `"${stats.mtime.getTime()}-${stats.size}"`,
            },
        })

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการให้บริการรูปภาพ:', error)
        return new NextResponse('ไม่สามารถให้บริการรูปภาพได้', { status: 500 })
    }
}