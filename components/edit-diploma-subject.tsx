"use client"

import { useState, useEffect } from "react"
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
import { FilePenLine, Check, ChevronsUpDown } from "lucide-react"
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
    prereqs: {
        prereq: {
            code: string
            title: string
        }
    }[]
}

interface FormData {
    groupName: string
    code: string
    title: string
    credits: string
}

interface EditDiplomaSubjectProps {
    subject?: Subject
    onSubjectUpdated?: () => void
}

export default function EditDiplomaSubject({ subject, onSubjectUpdated }: EditDiplomaSubjectProps) {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [openPrereq1, setOpenPrereq1] = useState(false)
    const [openPrereq2, setOpenPrereq2] = useState(false)
    const [prerequisite1, setPrerequisite1] = useState("")
    const [prerequisite2, setPrerequisite2] = useState("")
    const [formData, setFormData] = useState<FormData>({
        groupName: "",
        code: "",
        title: "",
        credits: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // ดึงข้อมูลรายวิชาทั้งหมดสำหรับ combobox
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch('/api/diploma-subjects')
                const data = await response.json()
                if (data.success) {
                    setSubjects(data.subjects)
                }
            } catch (error) {
                console.error('Error fetching diploma subjects:', error)
            }
        }
        fetchSubjects()
    }, [])

    // ตั้งค่าข้อมูลเริ่มต้นเมื่อมีข้อมูล subject
    useEffect(() => {
        if (subject) {
            setFormData({
                groupName: subject.groupName || "none",
                code: subject.code,
                title: subject.title,
                credits: subject.credits.toString()
            })
            // ตั้งค่าวิชาบังคับก่อน
            if (subject.prereqs.length > 0) {
                setPrerequisite1(subject.prereqs[0]?.prereq.code || "")
                setPrerequisite2(subject.prereqs[1]?.prereq.code || "")
            }
        }
    }, [subject])

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!formData.code || !formData.title || !formData.credits) {
            alert('กรุณากรอกรหัสวิชา ชื่อวิชา และหน่วยกิตให้ครบถ้วน')
            return
        }

        if (!subject) {
            alert('ไม่พบข้อมูลรายวิชาที่ต้องการแก้ไข')
            return
        }

        setIsLoading(true)
        try {
            const prerequisites = [prerequisite1, prerequisite2]
                .filter(prereq => prereq.trim() !== '')

            const response = await fetch(`/api/diploma-subjects/${subject.id}`, {
                method: 'PUT',
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
                alert('แก้ไขรายวิชาเรียบร้อยแล้ว')
                setIsOpen(false)
                // เรียก callback function เพื่อรีเฟรชข้อมูลใน parent component
                if (onSubjectUpdated) {
                    onSubjectUpdated()
                }
            } else {
                alert(result.error || 'เกิดข้อผิดพลาด')
            }
        } catch (error) {
            alert('ไม่สามารถแก้ไขรายวิชาได้')
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm">
                    <FilePenLine className="text-yellow-400" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>แก้ไขรายวิชา</DialogTitle>
                    <DialogDescription>
                        แก้ไขข้อมูลรายวิชาในหลักสูตร ปวส.
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

                    {/* วิชาบังคับก่อน 1 */}
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
                                        ? subjects.find((subj) => subj.code === prerequisite1)?.code + " - " + subjects.find((subj) => subj.code === prerequisite1)?.title
                                        : "เลือกวิชาบังคับก่อน..."
                                    }
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="ค้นหารายวิชา..." />
                                    <CommandEmpty>ไม่พบรายวิชา</CommandEmpty>
                                    <CommandGroup>
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
                                        {subjects
                                            .filter(subj => subj.code !== formData.code) // ไม่ให้เลือกตัวเอง
                                            .map((subj) => (
                                                <CommandItem
                                                    key={subj.id}
                                                    value={subj.code + " " + subj.title}
                                                    onSelect={() => {
                                                        setPrerequisite1(subj.code === prerequisite1 ? "" : subj.code)
                                                        setOpenPrereq1(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            prerequisite1 === subj.code ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{subj.code}</span>
                                                        <span className="text-sm text-muted-foreground">{subj.title}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* วิชาบังคับก่อน 2 */}
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
                                        ? subjects.find((subj) => subj.code === prerequisite2)?.code + " - " + subjects.find((subj) => subj.code === prerequisite2)?.title
                                        : "เลือกวิชาบังคับก่อน..."
                                    }
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="ค้นหารายวิชา..." />
                                    <CommandEmpty>ไม่พบรายวิชา</CommandEmpty>
                                    <CommandGroup>
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
                                            .filter(subj => subj.code !== formData.code && subj.code !== prerequisite1) // ไม่ให้เลือกตัวเองและวิชาบังคับก่อน 1
                                            .map((subj) => (
                                                <CommandItem
                                                    key={subj.id}
                                                    value={subj.code + " " + subj.title}
                                                    onSelect={() => {
                                                        setPrerequisite2(subj.code === prerequisite2 ? "" : subj.code)
                                                        setOpenPrereq2(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            prerequisite2 === subj.code ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{subj.code}</span>
                                                        <span className="text-sm text-muted-foreground">{subj.title}</span>
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
                        {isLoading ? "กำลังบันทึก..." : "แก้ไขข้อมูล"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}