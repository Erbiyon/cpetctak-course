"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselImage {
    id: string | number
    url: string
    activityBlog: {
        title: string
        activity: {
            title: string
        }
    }
}

export function CarouselPlugin() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    const [images, setImages] = React.useState<CarouselImage[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/activity-images')
                if (!response.ok) {
                    throw new Error('Failed to fetch images')
                }
                const data = await response.json()

                if (Array.isArray(data)) {
                    setImages(data)
                } else {
                    console.error('Data is not an array:', data)
                    setImages([])
                }
            } catch (error) {
                console.error('Error fetching images:', error)
                setImages([])
            } finally {
                setLoading(false)
            }
        }

        fetchImages()
    }, [])

    if (loading) {
        return (
            <Carousel className="w-full max-w-2xl">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-video items-center justify-center p-6">
                                    <span className="text-muted-foreground">กำลังโหลด...</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        )
    }

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <Carousel className="w-full max-w-2xl">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-video items-center justify-center p-6">
                                    <span className="text-muted-foreground text-center">
                                        ยังไม่มีรูปภาพกิจกรรม
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        )
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-2xl"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {images.map((image) => (
                    <CarouselItem key={image.id}>
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                            <Image
                                src={image.url}
                                alt={image.activityBlog.activity.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                                <p className="text-xs font-medium truncate">
                                    {image.activityBlog.title}
                                </p>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}