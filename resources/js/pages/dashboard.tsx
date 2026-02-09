import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ClipboardList } from "lucide-react"; // مكتبة الأيقونات الافتراضية في لارافيل

// تعريف أنواع البيانات القادمة من الباك-إند
interface DashboardProps {
    stats: {
        students_count: number;
        courses_count: number;
        enrollments_count: number;
    };
    recent_enrollments: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    // استلام البيانات من Inertia
    const { stats, recent_enrollments } = usePage().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">

                {/* القسم العلوي: بطاقات الإحصائيات */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.students_count || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.courses_count || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.enrollments_count || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* القسم السفلي: جدول أحدث التسجيلات */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 bg-card">
                    <h2 className="text-lg font-semibold mb-4">Recent Enrollments</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left font-medium text-muted-foreground">
                                    <th className="py-3 px-2">Student</th>
                                    <th className="py-3 px-2">Course</th>
                                    <th className="py-3 px-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_enrollments?.map((enrollment) => (
                                    <tr key={enrollment.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-2 font-medium">{enrollment.student?.name}</td>
                                        <td className="py-3 px-2">{enrollment.course?.name}</td>
                                        <td className="py-3 px-2 text-muted-foreground">
                                            {new Date(enrollment.enrollment_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                                {(!recent_enrollments || recent_enrollments.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-muted-foreground">
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
