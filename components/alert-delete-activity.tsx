import { Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";

interface AlertDeleteActivityProps {
    activity: {
        id: number;
        title: string;
    };
    onDelete: (id: number) => Promise<void>;
}

export default function AlertDeleteActivity({ activity, onDelete }: AlertDeleteActivityProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(activity.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    title="ลบ"
                >
                    <Trash className="text-red-400" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">ยืนยันการลบกิจกรรม</AlertDialogTitle>
                    <AlertDialogDescription>
                        คุณแน่ใจหรือไม่ที่จะลบกิจกรรม <strong>{activity.title}</strong> นี้?
                        <br /><br />
                        การดำเนินการนี้ไม่สามารถยกเลิกได้ และข้อมูลกิจกรรมจะถูกลบออกจากระบบอย่างถาวร
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? "กำลังลบ..." : "ลบกิจกรรม"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}