<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;
use Illuminate\Support\Facades\Redirect;

class TeacherController extends Controller
{
    //
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $teachers = Teacher::where('tenant_id', $tenantId)->get();
        return Inertia::render('teacher/index', [
            'teachers' => $teachers,
        ]);
    }
    public function store(Request $request)
    {
        $validated=$request->validate([
            'name'=>'required|string|max:50',
            'specialization'=>'required|string|max:50',
        ]);
        $validated['tenant_id']=Auth::user()->tenant_id;
        Teacher::create($validated);
        return Redirect::route('teachers.index');

    }

    public function update(Request $request,$id){
         $validated=$request->validate([
            'name'=>'required|string|max:50',
            'specialization'=>'required|string|max:50',
        ]);
        $teacher=Teacher::where('tenant_id',Auth::user()->tenant_id)->findOrFail($id);
        $teacher->update($validated);
        return Redirect::route('teachers.index');
    }

    public function destroy($id){
        $teacher=Teacher::where('tenant_id',Auth::user()->tenant_id)->findOrFail($id);
        $teacher->delete($id);
        return Redirect::route('teachers.index');
    }
}
