import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // ดึงบทความที่ publish แล้วและมีรูปภาพใน content
        const publishedBlogs = await prisma.activityBlog.findMany({
            where: {
                isPublished: true,
                content: {
                    contains: '<img'
                }
            },
            include: {
                activity: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        })

        console.log('Published blogs with images:', publishedBlogs.length)

        // สกัดรูปจาก HTML content
        const extractedImages = []
        let imageCount = 0

        for (const blog of publishedBlogs) {
            // ใช้ regex หา img tags
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
            let match

            while ((match = imgRegex.exec(blog.content)) !== null && imageCount < 10) {
                const imageUrl = match[1]

                // ตรวจสอบว่าเป็นรูปจาก activity-blogs หรือไม่
                if (imageUrl.includes('/api/images/activity-blogs/')) {
                    extractedImages.push({
                        id: `${blog.id}-${imageCount}`,
                        url: imageUrl,
                        activityBlog: {
                            title: blog.title,
                            activity: {
                                title: blog.activity.title
                            }
                        }
                    })
                    imageCount++
                }
            }
        }

        console.log('Extracted images from content:', extractedImages.length)

        // ถ้าไม่มีรูปใน published blogs ให้ดึงจากบทความทั้งหมด
        if (extractedImages.length === 0) {
            const allBlogs = await prisma.activityBlog.findMany({
                where: {
                    content: {
                        contains: '<img'
                    }
                },
                include: {
                    activity: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            })

            for (const blog of allBlogs) {
                const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
                let match

                while ((match = imgRegex.exec(blog.content)) !== null && imageCount < 5) {
                    const imageUrl = match[1]

                    if (imageUrl.includes('/api/images/activity-blogs/')) {
                        extractedImages.push({
                            id: `${blog.id}-${imageCount}`,
                            url: imageUrl,
                            activityBlog: {
                                title: blog.title,
                                activity: {
                                    title: blog.activity.title
                                }
                            }
                        })
                        imageCount++
                    }
                }
            }

            console.log('Using images from all blogs:', extractedImages.length)
        }

        return NextResponse.json(extractedImages)
    } catch (error) {
        console.error('Error fetching activity images:', error)
        return NextResponse.json([], { status: 200 })
    }
}