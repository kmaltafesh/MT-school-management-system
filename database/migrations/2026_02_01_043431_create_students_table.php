<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('students', function (Blueprint $table) {
    $table->id();

    $table->foreignId('tenant_id')
          ->constrained('tenants')
          ->cascadeOnDelete();

    $table->string('student_code')->unique();
    $table->string('name');
    $table->foreignId('grade_id')->constrained();
    $table->date('birth_date');
    $table->enum('gender', ['male', 'female'])->nullable();

    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
