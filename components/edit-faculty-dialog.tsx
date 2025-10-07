"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import { toast } from "sonner"

interface FacultyMember {
    id: number
    firstName: string
    lastName: string
    imageUrl?: string
}

interface EditFacultyDialogProps {
    faculty: FacultyMember | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onFacultyUpdated?: () => void
}

export function EditFacultyDialog({ faculty, open, onOpenChange, onFacultyUpdated }: EditFacultyDialogProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        imageUrl: ""
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        if (faculty) {
            setFormData({
                firstName: faculty.firstName,
                lastName: faculty.lastName,
                imageUrl: faculty.imageUrl || ""
            })
            setImagePreview(faculty.imageUrl || "")
        }
    }, [faculty])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)

        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!faculty) return

        try {
            const response = await fetch(`/api/faculty/${faculty.id}`, {
                method: 'PUT',
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
                throw new Error('Failed to update faculty')
            }

            const result = await response.json()
            console.log('Faculty updated:', result)

            toast.success('แก้ไขข้อมูลบุคลากรสำเร็จ!')

            onOpenChange(false)

            if (onFacultyUpdated) {
                onFacultyUpdated()
            }
        } catch (error) {
            console.error('Error updating faculty:', error)
            toast.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล')
        }
    }

    const resetForm = () => {
        setFormData({ firstName: "", lastName: "", imageUrl: "" })
        setImagePreview("")
    }

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen)
        if (!newOpen) {
            resetForm()
        }
    }

    if (!faculty) return null

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>แก้ไขข้อมูลบุคลากร</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

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
                        <Label htmlFor="edit-image-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Upload className="h-4 w-4" />
                                เปลี่ยนรูปภาพ
                            </div>
                        </Label>
                        <Input
                            id="edit-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="edit-firstName">ชื่อ</Label>
                        <Input
                            id="edit-firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="กรอกชื่อ"
                            required
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="edit-lastName">นามสกุล</Label>
                        <Input
                            id="edit-lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="กรอกนามสกุล"
                            required
                        />
                    </div>


                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
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