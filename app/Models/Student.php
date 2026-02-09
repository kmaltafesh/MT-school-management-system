<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    //
     use HasFactory;

    //

     protected $fillable = [
        'tenant_id',
        'grade_id',
        'name',
        'gender',
        'student_code',
        'birth_date'
        
    ];

    protected $casts = [
    'birth_date' => 'date',
];

    

    public function tenant(){
        return $this->belongsTo(Tenant::class);
    }

    public function course(){
        return $this->hasMany(Course::class);
    }
    public function grade(){
        return $this->belongsTo(Grade::class);
    }
    public function enrollments()
{
    return $this->hasMany(Enrollment::class);
}
}
