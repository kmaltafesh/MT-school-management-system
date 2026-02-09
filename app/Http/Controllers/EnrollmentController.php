<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class EnrollmentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        // جلب التسجيلات مع بيانات الطالب والكورس المرتبطة
        $enrollments = Enrollment::where('tenant_id', $tenantId)
            ->with(['student:id,name,student_code', 'course:id,name'])
            ->latest()
            ->get();

        // جلب قوائم الاختيار
        $students = Student::where('tenant_id', $tenantId)->select('id', 'name', 'student_code')->get();
        $courses = Course::where('tenant_id', $tenantId)->select('id', 'name')->get();

        return Inertia::render('enrollment/index', [
            'enrollments' => $enrollments,
            'students' => $students,
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;

        $validated = $request->validate([
            'student_id' => [
                'required',
                Rule::exists('students', 'id')->where('tenant_id', $tenantId),
            ],
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where('tenant_id', $tenantId),
            ],
            'enrollment_date' => 'required|date'
        ]);

        $validated['tenant_id'] = $tenantId;

        Enrollment::create($validated);

        return Redirect::route('enrollments.index')
            ->with('success', 'Enrollment created successfully.');
    }

    public function update(Request $request, $id)
    {
        $tenantId = Auth::user()->tenant_id;
        $enrollment = Enrollment::where('tenant_id', $tenantId)->findOrFail($id);

        $validated = $request->validate([
            'student_id' => [
                'required',
                Rule::exists('students', 'id')->where('tenant_id', $tenantId),
            ],
            'course_id' => [
                'required',
                Rule::exists('courses', 'id')->where('tenant_id', $tenantId),
            ],
            'enrollment_date' => 'required|date'
        ]);

        $enrollment->update($validated);

        return Redirect::route('enrollments.index')
            ->with('success', 'Enrollment updated successfully.');
    }

    public function destroy($id)
    {
        $tenantId = Auth::user()->tenant_id;
        $enrollment = Enrollment::where('tenant_id', $tenantId)->findOrFail($id);
        $enrollment->delete();

        return Redirect::route('enrollments.index')
            ->with('success', 'Enrollment deleted successfully.');
    }
}