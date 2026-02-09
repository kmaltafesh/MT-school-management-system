<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    //
    use HasFactory;

     protected $fillable = [
        'tenant_id',
        'name',       
        'teacher_id',
        'grade_id',   
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class);
    }
}
