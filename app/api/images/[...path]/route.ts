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

        // Security check - prevent path traversal
        if (imagePath.includes('..') || imagePath.includes('\\')) {
            return new NextResponse('Invalid path', { status: 400 })
        }

        const filePath = join(process.cwd(), 'public', 'uploads', imagePath)

        // Check if file exists
        if (!existsSync(filePath)) {
            console.log(`Image not found: ${filePath}`)
            return new NextResponse('Image not found', { status: 404 })
        }

        // Get file stats for headers
        const stats = await stat(filePath)

        // Read file
        const fileBuffer = await readFile(filePath)

        // Determine content type based on file extension
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

        // Return image with proper headers
        return new NextResponse(new Uint8Array(fileBuffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': stats.size.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate', // Force reload
                'Pragma': 'no-cache',
                'Expires': '0',
                'Last-Modified': stats.mtime.toUTCString(),
                'ETag': `"${stats.mtime.getTime()}-${stats.size}"`,
            },
        })

    } catch (error) {
        console.error('Error serving image:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}