"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Upload } from "lucide-react"
import { toast } from "sonner"

interface FacultyMember {
    id: number
    firstName: string
    lastName: string
    imageUrl?: string
}

export function AddFaculty({ onFacultyAdded }: { onFacultyAdded?: () => void }) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        imageUrl: ""
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // สร้าง preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    imageUrl: imagePreview || null
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create faculty')
            }

            const result = await response.json()
            console.log('Faculty created:', result)

            toast.success('เพิ่มบุคลากรสำเร็จ!')

            setFormData({ firstName: "", lastName: "", imageUrl: "" })
            setImagePreview("")
            setOpen(false)

            if (onFacultyAdded) {
                onFacultyAdded()
            }
        } catch (error) {
            console.error('Error creating faculty:', error)
            toast.error('เกิดข้อผิดพลาดในการเพิ่มบุคลากร')
        }
    }

    const resetForm = () => {
        setFormData({ firstName: "", lastName: "", imageUrl: "" })
        setImagePreview("")
    }

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen)
            if (!newOpen) {
                resetForm()
            }
        }}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    เพิ่มบุคลากร
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>เพิ่มบุคลากรใหม่</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* รูปภาพ */}
                    <div className="flex flex-col items-center space-y-2">
                        <Avatar className="w-24 h-24">
                            <AvatarImage
                                src={imagePreview || undefined}
                                className="object-cover w-full h-full"
                            />
                            <AvatarFallback>
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Upload className="h-4 w-4" />
                                อัพโหลดรูปภาพ
                            </div>
                        </Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* ชื่อ */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName">ชื่อ</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="กรอกชื่อ"
                            required
                        />
                    </div>

                    {/* นามสกุล */}
                    <div className="space-y-2">
                        <Label htmlFor="lastName">นามสกุล</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="กรอกนามสกุล"
                            required
                        />
                    </div>

                    {/* ปุ่ม */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!formData.firstName || !formData.lastName}
                        >
                            บันทึก
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}