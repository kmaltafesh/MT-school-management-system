<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\Grade;
use Illuminate\Support\Facades\Redirect;

class CourseController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        
        $courses = Course::where('tenant_id', $tenantId)
            ->with('teacher', 'grade')
            ->get();
        
        $teachers = Teacher::where('tenant_id', $tenantId)->get();
        $grades = Grade::where('tenant_id', $tenantId)->get();

        return Inertia::render('course/index', [
            'courses' => $courses,
            'teachers' => $teachers,
            'grades' => $grades
        ]);
    }

    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;

        $request->validate([
            'name' => 'required|string|max:100',
            'teacher_id' => 'required|integer|exists:teachers,id',
            'grade_id' => 'required|integer|exists:grades,id',
        ]);

        Course::create([
            'tenant_id' => $tenantId,
            'name' => $request->name,
            'teacher_id' => $request->teacher_id,
            'grade_id' => $request->grade_id,
        ]);

        return Redirect::route('courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function update(Request $request, $id)
    {
        $tenantId = Auth::user()->tenant_id;
        
        $course = Course::where('tenant_id', $tenantId)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'teacher_id' => 'required|integer|exists:teachers,id',
            'grade_id' => 'required|integer|exists:grades,id',
        ]);

        $course->update([
            'name' => $request->name,
            'teacher_id' => $request->teacher_id,
            'grade_id' => $request->grade_id,
        ]);

        return Redirect::route('courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy($id)
    {
        $tenantId = Auth::user()->tenant_id;
        
        $course = Course::where('tenant_id', $tenantId)->findOrFail($id);
     

        $course->delete();

        return Redirect::route('courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}