<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    //
        protected $fillable = [
        'tenant_id',
        'name',
        'specialization',   
    ];
 
        public function tenant(){
            return $this->belongsTo(Tenant::class);
        }
        public function course(){
            return $this->hasMany(Course::class);
        }

       

}
