"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Subject {
    id: number
    code: string
    title: string
    groupName: string
    credits: number
}

interface FormData {
    groupName: string
    code: string
    title: string
    credits: string
}

interface AddBachelorSubjectProps {
    onSubjectAdded?: () => void
}

export default function AddBachelorSubject({ onSubjectAdded }: AddBachelorSubjectProps) {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [openPrereq1, setOpenPrereq1] = useState(false)
    const [openPrereq2, setOpenPrereq2] = useState(false)
    const [prerequisite1, setPrerequisite1] = useState("")
    const [prerequisite2, setPrerequisite2] = useState("")
    const [formData, setFormData] = useState<FormData>({
        groupName: "none",
        code: "",
        title: "",
        credits: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch('/api/subjects')
                const data = await response.json()
                if (data.success) {
                    setSubjects(data.subjects)
                }
            } catch (error) {
                console.error('Error fetching subjects:', error)
            }
        }
        fetchSubjects()
    }, [])

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {

        if (!formData.code || !formData.title || !formData.credits) {
            toast.error('กรุณากรอกรหัสวิชา ชื่อวิชา และหน่วยกิตให้ครบถ้วน')
            return
        }

        setIsLoading(true)
        try {
            const prerequisites = [prerequisite1, prerequisite2]
                .filter(prereq => prereq.trim() !== '')

            const response = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupName: formData.groupName === "none" ? "" : formData.groupName,
                    code: formData.code,
                    title: formData.title,
                    credits: formData.credits,
                    prerequisites,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success('เพิ่มรายวิชาเรียบร้อยแล้ว')

                setFormData({
                    groupName: "none",
                    code: "",
                    title: "",
                    credits: ""
                })
                setPrerequisite1("")
                setPrerequisite2("")
                setIsOpen(false)

                if (onSubjectAdded) {
                    onSubjectAdded()
                }
            } else {
                toast.error(result.error || 'เกิดข้อผิดพลาด')
            }
        } catch (error) {
            toast.error('ไม่สามารถเพิ่มรายวิชาได้')
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มรายวิชา
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>เพิ่มรายวิชาใหม่</DialogTitle>
                    <DialogDescription>
                        กรอกข้อมูลรายวิชาที่ต้องการเพิ่มในหลักสูตร
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 my-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="subject-group">กลุ่มวิชา</Label>
                            <Select value={formData.groupName} onValueChange={(value) => handleInputChange('groupName', value)}>
                                <SelectTrigger className="w-[136px]">
                                    <SelectValue placeholder="เลือกกลุ่มวิชา" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>กลุ่มวิชา</SelectLabel>
                                        <SelectItem value="none">ไม่เลือก</SelectItem>
                                        <SelectItem value="พื้นฐานวิชาชีพ">พื้นฐานวิชาชีพ</SelectItem>
                                        <SelectItem value="ชีพบังคับ">ชีพบังคับ</SelectItem>
                                        <SelectItem value="ชีพเลือก">ชีพเลือก</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="subject-code">รหัสวิชา</Label>
                            <Input
                                type="text"
                                id="subject-code"
                                placeholder="กรอกรหัสวิชา"
                                className="w-full"
                                value={formData.code}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="subject-credits">หน่วยกิต</Label>
                            <Input
                                type="number"
                                id="subject-credits"
                                placeholder="กรอกหน่วยกิต"
                                className="w-full"
                                value={formData.credits}
                                onChange={(e) => handleInputChange('credits', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subject-name">ชื่อวิชา</Label>
                        <Input
                            type="text"
                            id="subject-name"
                            placeholder="กรอกชื่อวิชา"
                            className="w-full"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                    </div>


                    <div className="flex flex-col gap-2">
                        <Label>วิชาบังคับก่อน 1</Label>
                        <Popover open={openPrereq1} onOpenChange={setOpenPrereq1}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openPrereq1}
                                    className="w-full justify-between"
                                >
                                    {prerequisite1
                                        ? subjects.find((subject) => subject.code === prerequisite1)?.code + " - " + subjects.find((subject) => subject.code === prerequisite1)?.title
                                        : "เลือกวิชาบังคับก่อน..."
                                    }
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="ค้นหารายวิชา..." />
                                    <CommandEmpty>ไม่พบรายวิชา</CommandEmpty>
                                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                                        <CommandItem
                                            value="ไม่เลือก"
                                            onSelect={() => {
                                                setPrerequisite1("")
                                                setOpenPrereq1(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    prerequisite1 === "" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span className="text-muted-foreground">ไม่เลือก</span>
                                        </CommandItem>
                                        {subjects.map((subject) => (
                                            <CommandItem
                                                key={subject.id}
                                                value={subject.code + " " + subject.title}
                                                onSelect={() => {
                                                    setPrerequisite1(subject.code === prerequisite1 ? "" : subject.code)
                                                    setOpenPrereq1(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        prerequisite1 === subject.code ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{subject.code}</span>
                                                    <span className="text-sm text-muted-foreground">{subject.title}</span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>


                    <div className="flex flex-col gap-2">
                        <Label>วิชาบังคับก่อน 2</Label>
                        <Popover open={openPrereq2} onOpenChange={setOpenPrereq2}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openPrereq2}
                                    className="w-full justify-between"
                                >
                                    {prerequisite2
                                        ? subjects.find((subject) => subject.code === prerequisite2)?.code + " - " + subjects.find((subject) => subject.code === prerequisite2)?.title
                                        : "เลือกวิชาบังคับก่อน..."
                                    }
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="ค้นหารายวิชา..." />
                                    <CommandEmpty>ไม่พบรายวิชา</CommandEmpty>
                                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                                        <CommandItem
                                            value="ไม่เลือก"
                                            onSelect={() => {
                                                setPrerequisite2("")
                                                setOpenPrereq2(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    prerequisite2 === "" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span className="text-muted-foreground">ไม่เลือก</span>
                                        </CommandItem>
                                        {subjects
                                            .filter(subject => subject.code !== prerequisite1)
                                            .map((subject) => (
                                                <CommandItem
                                                    key={subject.id}
                                                    value={subject.code + " " + subject.title}
                                                    onSelect={() => {
                                                        setPrerequisite2(subject.code === prerequisite2 ? "" : subject.code)
                                                        setOpenPrereq2(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            prerequisite2 === subject.code ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{subject.code}</span>
                                                        <span className="text-sm text-muted-foreground">{subject.title}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>ยกเลิก</Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}