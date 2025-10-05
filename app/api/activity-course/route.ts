import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(activities)
    } catch (error) {
        console.error('Error fetching activities:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title } = body

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        const activity = await prisma.activity.create({
            data: {
                title
            }
        })

        return NextResponse.json(activity, { status: 201 })
    } catch (error) {
        console.error('Error creating activity:', error)
        return NextResponse.json(
            { error: 'Failed to create activity' },
            { status: 500 }
        )
    }
}