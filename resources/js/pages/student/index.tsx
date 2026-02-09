import { type BreadcrumbItem } from "@/types";
import { usePage, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Student {
    id: number;
    tenant_id: number;
    name: string;
    student_code: string;
    grade_id: number | string;
    birth_date: string;
    gender: "male" | "female";
}

interface FormData {
    id?: number;
    name: string;
    student_code: string;
    grade_id: string | number;
    birth_date: string;
    gender: "male" | "female";
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Students",
        href: "/students",
    },
];

const initialFormState: FormData = {
    name: "",
    student_code: "",
    grade_id: "",
    birth_date: "",
    gender: "male",
};

export default function StudentIndex() {
    const { students } = usePage().props as { students?: Student[] };
    const studentList = students ?? [];

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm<FormData>(initialFormState);

    /**
     * تنسيق التاريخ من ISO إلى YYYY-MM-DD
     * يتعامل مع التنسيقات المختلفة مثل:
     * - 2026-02-12T00:00:00.000000Z
     * - 2026-02-12
     * - 2026-02-12 00:00:00
     */
    const formatDate = (dateString: string): string => {
        if (!dateString) return "";
        
        try {
            const date = new Date(dateString);
            
            // التحقق من صحة التاريخ
            if (isNaN(date.getTime())) {
                return dateString;
            }
            
            // تنسيق التاريخ إلى YYYY-MM-DD فقط
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            
            return `${year}-${month}-${day}`;
        } catch {
            return dateString;
        }
    };

    /**
     * تنسيق التاريخ للعرض في الجدول
     */
    const formatDateForDisplay = (dateString: string): string => {
        const formattedDate = formatDate(dateString);
        
        if (!formattedDate) return "";
        
        // تنسيق أكثر جمالاً: Feb 12, 2026
        const date = new Date(formattedDate);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const getGenderLabel = (gender: string): string => {
        return gender === "male" ? "Male" : "Female";
    };

    const handleOpenAdd = () => {
        reset();
        clearErrors();
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (student: Student) => {
        clearErrors();
        setData({
            id: student.id,
            name: student.name,
            student_code: student.student_code,
            grade_id: student.grade_id,
            birth_date: formatDate(student.birth_date),
            gender: student.gender,
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && data.id) {
            put(`/students/${data.id}`, {
                onSuccess: handleClose,
            });
        } else {
            post("/students", {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the student "${name}"?`)) {
            router.delete(`/students/${id}`, {
                onSuccess: () => {
                    // Optional: Show a success message
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <Button onClick={handleOpenAdd}>Add New Student</Button>
                </div>

                {studentList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No students found. Click "Add New Student" to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm rounded-lg">
                            <thead className="bg-gray-100 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-3 text-center font-semibold w-16">ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Student Code</th>
                                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Birth Date</th>
                                    <th className="px-4 py-3 text-left font-semibold">Gender</th>
                                    <th className="px-4 py-3 text-left font-semibold">Grade ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map((student, index) => (
                                    <tr key={student.id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                        <td className="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{student.student_code}</td>
                                        <td className="px-4 py-3 font-medium">{student.name}</td>
                                        <td className="px-4 py-3">{formatDateForDisplay(student.birth_date)}</td>
                                        <td className="px-4 py-3">{getGenderLabel(student.gender)}</td>
                                        <td className="px-4 py-3">{student.grade_id}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => handleOpenEdit(student)}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive" 
                                                onClick={() => handleDelete(student.id, student.name)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit Student Information" : "Add New Student"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter student name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="student_code">Student Code *</Label>
                                <Input
                                    id="student_code"
                                    placeholder="Enter student code"
                                    value={data.student_code}
                                    onChange={(e) => setData("student_code", e.target.value)}
                                    required
                                    className={errors.student_code ? "border-red-500" : ""}
                                />
                                {errors.student_code && (
                                    <div className="text-red-500 text-xs mt-1">{errors.student_code}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Birth Date *</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData("birth_date", e.target.value)}
                                    required
                                    className={errors.birth_date ? "border-red-500" : ""}
                                />
                                {errors.birth_date && (
                                    <div className="text-red-500 text-xs mt-1">{errors.birth_date}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) => setData("gender", e.target.value as "male" | "female")}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && (
                                    <div className="text-red-500 text-xs mt-1">{errors.gender}</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade_id">Grade ID *</Label>
                            <Input
                                id="grade_id"
                                type="number"
                                placeholder="Enter grade ID"
                                value={data.grade_id}
                                onChange={(e) => setData("grade_id", parseInt(e.target.value) || "")}
                                required
                                className={errors.grade_id ? "border-red-500" : ""}
                            />
                            {errors.grade_id && (
                                <div className="text-red-500 text-xs mt-1">{errors.grade_id}</div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-6 border-t">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                            >
                                {processing ? "Saving..." : isEdit ? "Update" : "Save"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}