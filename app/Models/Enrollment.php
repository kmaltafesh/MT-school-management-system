<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
  use HasFactory;

    //

     protected $fillable = [
        'tenant_id',
        'student_id',
        'course_id',   
        'enrollment_date',
    ];
       protected $casts = [
    'enrollment_date' => 'date',
];

   public function student(){
      return $this->belongsTo(Student::class);
   }

   public function course(){
      return $this->belongsTo(Course::class);
   }
   public function tenant(){
      return $this->belongsTo(Tenant::class);
   }

   public function enrollments()
{
    return $this->hasMany(Enrollment::class);
}
}
