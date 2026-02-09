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
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// --- Interfaces ---
interface Student {
    id: number;
    name: string;
    student_code: string;
}

interface Course {
    id: number;
    name: string;
}

interface Enrollment {
    id: number;
    student_id: number;
    course_id: number;
    enrollment_date: string;
    student?: Student;
    course?: Course;
}

interface FormData {
    id?: number;
    student_id: string | number;
    course_id: string | number;
    enrollment_date: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Enrollments", href: "/enrollments" },
];

export default function EnrollmentIndex() {
    // استقبال البيانات من Laravel/Inertia
    const { enrollments, students, courses } = usePage().props as any;

    const [openDialog, setOpenDialog] = useState(false);
    const [openStudentSelect, setOpenStudentSelect] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm<FormData>({
            student_id: "",
            course_id: "",
            enrollment_date: new Date().toISOString().split('T')[0], // التاريخ الحالي تلقائياً
        });

    // --- Handlers ---
    const handleOpenAdd = () => {
        reset();
        clearErrors();
        setIsEdit(false);
        setOpenDialog(true);
    };

    const handleOpenEdit = (enrollment: Enrollment) => {
        clearErrors();
        setData({
            id: enrollment.id,
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
            enrollment_date: enrollment.enrollment_date,
        });
        setIsEdit(true);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && data.id) {
            put(`/enrollments/${data.id}`, { onSuccess: handleClose });
        } else {
            post("/enrollments", { onSuccess: handleClose });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this enrollment?")) {
            router.delete(`/enrollments/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6 shadow-sm border-none bg-white dark:bg-neutral-900">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Enrollments</h1>
                        <p className="text-sm text-muted-foreground">Manage student registrations in courses.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="gap-2">
                        <span>+ Add Enrollment</span>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
                    <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <th className="px-4 py-4 text-center font-medium">#</th>
                                <th className="px-4 py-4 text-left font-medium">Student Name</th>
                                <th className="px-4 py-4 text-left font-medium">Course</th>
                                <th className="px-4 py-4 text-left font-medium">Enrollment Date</th>
                                <th className="px-4 py-4 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {enrollments.length > 0 ? (
                                enrollments.map((enrollment: Enrollment, index: number) => (
                                    <tr key={enrollment.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-4 py-4 text-center text-muted-foreground">{index + 1}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-neutral-900 dark:text-neutral-100">{enrollment.student?.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">ID: {enrollment.student?.student_code}</div>
                                        </td>
                                        <td className="px-4 py-4 font-medium">{enrollment.course?.name}</td>
                                        <td className="px-4 py-4 text-neutral-600 dark:text-neutral-400">
                                            {new Date(enrollment.enrollment_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                {/* Edit */}
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="hover:scale-105 transition"
                                                    onClick={() => handleOpenEdit(enrollment)}
                                                >
                                                    Edit
                                                </Button>

                                                {/* Delete */}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="hover:scale-105 transition"
                                                    onClick={() => handleDelete(enrollment.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Dialog Form */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{isEdit ? "Update Enrollment" : "New Enrollment"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">

                        {/* 1. Student Searchable Select (Combobox) */}
                        <div className="space-y-2 flex flex-col">
                            <Label>Student Search</Label>
                            <Popover open={openStudentSelect} onOpenChange={setOpenStudentSelect}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openStudentSelect}
                                        className={cn("w-full justify-between font-normal", !data.student_id && "text-muted-foreground")}
                                    >
                                        {data.student_id
                                            ? students.find((s: Student) => s.id == data.student_id)?.name
                                            : "Search by name or code..."}
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0 shadow-lg" align="start">
                                    <Command>
                                        <CommandInput placeholder="Type student name or code..." />
                                        <CommandList>
                                            <CommandEmpty>No student matched your search.</CommandEmpty>
                                            <CommandGroup>
                                                {students.map((student: Student) => (
                                                    <CommandItem
                                                        key={student.id}
                                                        value={`${student.name} ${student.student_code}`}
                                                        onSelect={() => {
                                                            setData("student_id", student.id);
                                                            setOpenStudentSelect(false);
                                                        }}
                                                        className="cursor-pointer py-3"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4 text-primary",
                                                                data.student_id == student.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{student.name}</span>
                                                            <span className="text-xs text-muted-foreground">{student.student_code}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
                        </div>

                        {/* 2. Course Select */}
                        <div className="space-y-2">
                            <Label>Course</Label>
                            <select
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={data.course_id}
                                onChange={(e) => setData("course_id", e.target.value)}
                                required
                            >
                                <option value="">-- Choose Course --</option>
                                {courses.map((c: Course) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>}
                        </div>

                        {/* 3. Date Input */}
                        <div className="space-y-2">
                            <Label>Enrollment Date</Label>
                            <Input
                                type="date"
                                value={data.enrollment_date}
                                onChange={(e) => setData("enrollment_date", e.target.value)}
                                className="w-full"
                                required
                            />
                            {errors.enrollment_date && <p className="text-red-500 text-xs mt-1">{errors.enrollment_date}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="min-w-[100px]">
                                {processing ? "Saving..." : isEdit ? "Update Changes" : "Confirm Enrollment"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}