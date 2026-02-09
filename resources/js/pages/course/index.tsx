import { type BreadcrumbItem } from "@/types";
import { usePage, useForm, router } from "@inertiajs/react";
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

interface Teacher {
    id: number;
    name: string;
}

interface Grade {
    id: number;
    name: string;
}

interface Course {
    id: number;
    tenant_id: number;
    name: string;
    teacher_id: number;
    grade_id: number;
    teacher?: Teacher;
    grade?: Grade;
}

interface FormData {
    id?: number;
    name: string;
    teacher_id: string | number;
    grade_id: string | number;
}

interface PageProps {
    courses?: Course[];
    teachers?: Teacher[];
    grades?: Grade[];
    success?: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Courses",
        href: "/courses",
    },
];

const initialFormState: FormData = {
    name: "",
    teacher_id: "",
    grade_id: "",
};

export default function CourseIndex() {
    const { courses, teachers, grades, success, error } = usePage().props as PageProps;

    const courseList = courses ?? [];
    const teacherList = teachers ?? [];
    const gradeList = grades ?? [];

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm<FormData>(initialFormState);

    /**
     * Get teacher name by ID
     */
    const getTeacherName = (teacherId: number): string => {
        const teacher = teacherList.find((t) => t.id === teacherId);
        return teacher?.name || "Unknown";
    };

    /**
     * Get grade name by ID
     */
    const getGradeName = (gradeId: number): string => {
        const grade = gradeList.find((g) => g.id === gradeId);
        return grade?.name || "Unknown";
    };

    /**
     * Open dialog for adding a new course
     */
    const handleOpenAdd = () => {
        reset();
        clearErrors();
        setIsEdit(false);
        setOpen(true);
    };

    /**
     * Open dialog for editing a course
     */
    const handleOpenEdit = (course: Course) => {
        clearErrors();
        setData({
            id: course.id,
            name: course.name,
            teacher_id: course.teacher_id,
            grade_id: course.grade_id,
        });
        setIsEdit(true);
        setOpen(true);
    };

    /**
     * Close dialog and reset form
     */
    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };

    /**
     * Submit form (create or update)
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && data.id) {
            put(`/courses/${data.id}`, {
                onSuccess: handleClose,
            });
        } else {
            post("/courses", {
                onSuccess: handleClose,
            });
        }
    };

    /**
     * Delete course with confirmation
     */
  const [deleting, setDeleting] = useState(false);

const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the course "${name}"?`)) {
        setDeleting(true);
        router.delete(`/courses/${id}`, {
            onSuccess: () => {
                setDeleting(false);
            },
            onError: (error) => {
                setDeleting(false);
                console.error("Delete failed:", error);
                alert("Failed to delete course. Please try again.");
            },
        });
    }
};
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Success and Error Messages */}
            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                </div>
            )}

            <Card className="p-6 mt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <Button onClick={handleOpenAdd}>Add New Course</Button>
                </div>

                {/* Table */}
                {courseList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No courses found. Click "Add New Course" to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm rounded-lg">
                            <thead className="bg-gray-100 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-3 text-center font-semibold w-16">ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Course Name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Teacher</th>
                                    <th className="px-4 py-3 text-left font-semibold">Grade</th>
                                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {courseList.map((course, index) => (
                                    <tr
                                        key={course.id}
                                        className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{course.name}</td>
                                        <td className="px-4 py-3">{getTeacherName(course.teacher_id)}</td>
                                        <td className="px-4 py-3">{getGradeName(course.grade_id)}</td>

                                        <td className="px-4 py-3 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenEdit(course)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(course.id, course.name)}
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

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit Course Information" : "Add New Course"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Course Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Course Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter course name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                                disabled={processing}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                            )}
                        </div>

                        {/* Teacher Field */}
                        <div className="space-y-2">
                            <Label htmlFor="teacher_id">Teacher *</Label>
                            <select
                                id="teacher_id"
                                value={data.teacher_id}
                                onChange={(e) => setData("teacher_id", e.target.value)}
                                required
                                disabled={processing}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Select a teacher</option>
                                {teacherList.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teacher_id && (
                                <div className="text-red-500 text-xs mt-1">{errors.teacher_id}</div>
                            )}
                        </div>

                        {/* Grade Field */}
                        <div className="space-y-2">
                            <Label htmlFor="grade_id">Grade *</Label>
                            <select
                                id="grade_id"
                                value={data.grade_id}
                                onChange={(e) => setData("grade_id", e.target.value)}
                                required
                                disabled={processing}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Select a grade</option>
                                {gradeList.map((grade) => (
                                    <option key={grade.id} value={grade.id}>
                                        {grade.name}
                                    </option>
                                ))}
                            </select>
                            {errors.grade_id && (
                                <div className="text-red-500 text-xs mt-1">{errors.grade_id}</div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? isEdit
                                        ? "Updating..."
                                        : "Adding..."
                                    : isEdit
                                        ? "Update"
                                        : "Add"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}