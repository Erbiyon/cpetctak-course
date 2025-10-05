"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import { Button as ButtonCn } from "@/components/ui/button"
import { ArrowBigLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    onSave,
    isMobile,
    isSaving,
}: {
    onHighlighterClick: () => void
    onLinkClick: () => void
    onSave: () => void
    isMobile: boolean
    isSaving: boolean
}) => {
    return (
        <>
            <Spacer />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
                <ListDropdownMenu
                    types={["bulletList", "orderedList", "taskList"]}
                    portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Add" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <Button
                    onClick={onSave}
                    disabled={isSaving}
                    data-style="ghost"
                    aria-label="บันทึก"
                >
                    <Save className="tiptap-button-icon" />
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}

            <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup>
        </>
    )
}

const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: "highlighter" | "link"
    onBack: () => void
}) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent />
        ) : (
            <LinkContent />
        )}
    </>
)

interface SimpleEditorProps {
    mode?: 'create' | 'edit';
    blogId?: number;
    activityId?: number;
    initialContent?: string;
    activityTitle?: string;
    isPublished?: boolean;
}

export function SimpleEditor({
    mode = 'create',
    blogId,
    activityId: propActivityId,
    initialContent = '',
    activityTitle: propActivityTitle,
    isPublished: propIsPublished = false
}: SimpleEditorProps = {}) {
    const router = useRouter()
    const params = useParams()
    const activityId = propActivityId?.toString() || (params.id as string)

    const isMobile = useIsMobile()
    const { height } = useWindowSize()
    const [mobileView, setMobileView] = React.useState<
        "main" | "highlighter" | "link"
    >("main")
    const toolbarRef = React.useRef<HTMLDivElement>(null)

    // State for saving
    const [isSaving, setIsSaving] = useState(false)
    const [activity, setActivity] = useState<{ id: number; title: string } | null>(null)
    const [isPublished, setIsPublished] = useState(propIsPublished)
    const [showSaveDialog, setShowSaveDialog] = useState(false)

    // Fetch activity data
    useEffect(() => {
        if (mode === 'edit' && propActivityTitle) {
            // For edit mode, use provided activity title
            setActivity({
                id: parseInt(activityId),
                title: propActivityTitle
            });
            return;
        }

        const fetchActivity = async () => {
            try {
                const response = await fetch(`/api/activities/${activityId}`)
                if (response.ok) {
                    const data = await response.json()
                    setActivity(data)
                }
            } catch (error) {
                console.error('Error fetching activity:', error)
            }
        }

        if (activityId) {
            fetchActivity()
        }
    }, [activityId, mode, propActivityTitle])

    const handleSave = async () => {
        if (!editor || !activity) return

        // เปิด dialog เพื่อเลือกสถานะการเผยแพร่
        setShowSaveDialog(true)
    }

    const confirmSave = async () => {
        if (!editor || !activity) return

        setIsSaving(true)

        try {
            const content = editor.getHTML()

            if (mode === 'edit' && blogId) {
                // Edit existing blog
                const response = await fetch(`/api/activity-blogs/${blogId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content,
                        isPublished,
                    }),
                })

                if (response.ok) {
                    toast.success('แก้ไขบล็อกเรียบร้อยแล้ว')
                    setShowSaveDialog(false)
                    router.push('/activity-course')
                } else {
                    const errorData = await response.json()
                    toast.error(errorData.error || 'เกิดข้อผิดพลาดในการแก้ไข')
                }
            } else {
                // Create new blog
                const response = await fetch('/api/activity-blogs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        activityId: parseInt(activityId),
                        title: activity.title, // ใช้ชื่อกิจกรรม
                        content,
                        isPublished,
                    }),
                })

                if (response.ok) {
                    toast.success('บันทึกบล็อกเรียบร้อยแล้ว')
                    setShowSaveDialog(false)
                    router.push('/activity-course')
                } else {
                    const errorData = await response.json()
                    toast.error(errorData.error || 'เกิดข้อผิดพลาดในการบันทึก')
                }
            }
        } catch (error) {
            console.error('Error saving blog:', error)
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
        } finally {
            setIsSaving(false)
        }
    }

    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        content: initialContent, // ใช้ initial content หรือเริ่มต้นด้วยหน้าว่าง
    })

    const rect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    })

    React.useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main")
        }
    }, [isMobile, mobileView])

    return (
        <div className="simple-editor-wrapper">
            <EditorContext.Provider value={{ editor }}>
                <Toolbar
                    ref={toolbarRef}
                    className="mb-4"
                    style={{
                        ...(isMobile
                            ? {
                                bottom: `calc(100% - ${height - rect.y}px)`,
                            }
                            : {}),
                    }}
                >
                    {mobileView === "main" ? (
                        <MainToolbarContent
                            onHighlighterClick={() => setMobileView("highlighter")}
                            onLinkClick={() => setMobileView("link")}
                            onSave={handleSave}
                            isMobile={isMobile}
                            isSaving={isSaving}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={mobileView === "highlighter" ? "highlighter" : "link"}
                            onBack={() => setMobileView("main")}
                        />
                    )}
                </Toolbar>

                <Link href="/activity-course">
                    <ButtonCn variant="ghost" className="z-10 fixed top-1 left-4"><ArrowBigLeft /></ButtonCn>
                </Link>

                <EditorContent
                    editor={editor}
                    role="presentation"
                    className="simple-editor-content"
                />

                {/* Publish Status Dialog */}
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {mode === 'edit' ? 'แก้ไขบล็อกกิจกรรม' : 'บันทึกบล็อกกิจกรรม'}
                            </DialogTitle>
                            <DialogDescription>
                                {activity && `บล็อกสำหรับกิจกรรม: ${activity.title}`}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="publish-status"
                                    checked={isPublished}
                                    onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                                />
                                <Label htmlFor="publish-status">เผยแพร่ทันที</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <ButtonCn
                                variant="outline"
                                onClick={() => setShowSaveDialog(false)}
                            >
                                ยกเลิก
                            </ButtonCn>
                            <ButtonCn
                                onClick={confirmSave}
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? (mode === 'edit' ? 'กำลังแก้ไข...' : 'กำลังบันทึก...')
                                    : (mode === 'edit' ? 'แก้ไข' : 'บันทึก')
                                }
                            </ButtonCn>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </EditorContext.Provider>
        </div>
    )
}
