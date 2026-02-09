<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        return Inertia::render('dashboard', [
            'stats' => [
                'students_count'    => Student::where('tenant_id', $tenantId)->count(),
                'courses_count'     => Course::where('tenant_id', $tenantId)->count(),
                'enrollments_count' => Enrollment::where('tenant_id', $tenantId)->count(),
            ],
            'recent_enrollments' => Enrollment::where('tenant_id', $tenantId)
                ->with(['student', 'course'])
                ->latest()
                ->take(5)
                ->get()
        ]);
    }
}
