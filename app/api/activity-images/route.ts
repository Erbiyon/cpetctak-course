import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
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

        console.log('บล็อกที่เผยแพร่พร้อมรูปภาพ:', publishedBlogs.length)

        const extractedImages = []
        let imageCount = 0

        for (const blog of publishedBlogs) {
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
            let match

            while ((match = imgRegex.exec(blog.content)) !== null && imageCount < 10) {
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

        console.log('ภาพที่ดึงออกมาจากเนื้อหา:', extractedImages.length)

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

            console.log('การใช้รูปภาพจากบล็อกทั้งหมด:', extractedImages.length)
        }

        return NextResponse.json(extractedImages)
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพกิจกรรม:', error)
        return NextResponse.json([], { status: 200 })
    }
}