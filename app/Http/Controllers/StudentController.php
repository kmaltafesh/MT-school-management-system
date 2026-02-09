<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $students = Student::where('tenant_id', $tenantId)->get();
        return Inertia::render('student/index', [
            'students' => $students
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_code' => 'required|string|unique:students,student_code',
            'name'         => 'required|string|max:50',
            'grade_id'     => 'required|integer|exists:grades,id', 
            'birth_date'   => 'required|date',
            'gender'       => 'required|in:male,female' 
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Student::create($validated);

        return Redirect::route('students.index');
    }

    public function update(Request $request, $id)
    {
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);

        $validated = $request->validate([
            'student_code' => ['required', 'string', Rule::unique('students')->ignore($student->id)],
            'name'         => 'required|string|max:50',
            'grade_id'     => 'required|integer|exists:grades,id',
            'birth_date'   => 'required|date',
            'gender'       => 'required|in:male,female'
        ]);

        $student->update($validated);

        return Redirect::route('students.index'); 
    }

    public function destroy($id)
    {
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $student->delete(); 

        return Redirect::route('students.index'); 
    }
}
