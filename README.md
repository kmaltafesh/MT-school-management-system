# 📚 School Management System (Laravel + React + Inertia)

A modern multi-tenant school management system built with **Laravel**, **Inertia.js**, and **React (TypeScript)**.  
The system allows managing teachers, students, courses, grades, and enrollments in a clean and scalable way.

---

## ✨ Features

- 👨‍🏫 Teacher management
- 👨‍🎓 Student management
- 📘 Course creation and assignment
- 🏫 Grade organization
- 📝 Student enrollment in courses
- 🏢 Multi-tenant architecture (each school has its own data)
- 🔐 Authentication with Laravel Fortify
- ⚡ Modern UI with React + Tailwind + shadcn/ui

---

## 🧱 Tech Stack

### Backend
- Laravel 10+
- MySQL
- Eloquent ORM
- Laravel Fortify (Auth)

### Frontend
- React + TypeScript
- Inertia.js
- Tailwind CSS
- shadcn/ui
- Vite

---

## 📂 Project Structure

```
app/
 ├── Models/
 │    ├── Student.php
 │    ├── Teacher.php
 │    ├── Course.php
 │    ├── Grade.php
 │    └── Enrollment.php
 │
 ├── Http/Controllers/
 │    ├── StudentController.php
 │    ├── TeacherController.php
 │    ├── CourseController.php
 │    └── EnrollmentController.php
```

---

## 🗄️ Database Relationships

- Teacher → has many Courses  
- Course → belongs to Teacher  
- Student → enrolls in many Courses  
- Enrollment → pivot between Student & Course  
- Grade → groups students & courses  
- Tenant → separates data per school  

---

## 🚀 Installation

### 1️⃣ Clone the project

```bash
https://github.com/kmaltafesh/MT-school-management-system.git
cd school-system
```

### 2️⃣ Install dependencies

```bash
composer install
npm install
```

### 3️⃣ Setup environment

```bash
cp .env.example .env
php artisan key:generate
```

### 4️⃣ Configure database in `.env`

```
DB_DATABASE=school
DB_USERNAME=root
DB_PASSWORD=
```

### 5️⃣ Run migrations

```bash
php artisan migrate
```

### 6️⃣ Start servers

```bash
php artisan serve
npm run dev
```

---

## 🔐 Multi-Tenant Logic

Each record is linked to:

```
tenant_id
```

This ensures:
- Each school sees only its data
- Full isolation between tenants

Example:

```php
$tenantId = Auth::user()->tenant_id;

$students = Student::where('tenant_id', $tenantId)->get();
```

---

## 🧠 Main Modules

### 👨‍🎓 Students
- Create / Edit / Delete students
- Assign grade
- Store personal info

### 👨‍🏫 Teachers
- Manage teacher profiles
- Assign specialization

### 📘 Courses
- Linked to:
  - Teacher
  - Grade

### 📝 Enrollments
- Register student into course
- Track enrollment date

---

## 📌 Future Improvements

- Attendance system
- Exams & marks
- Parent portal
- Notifications
- Reports & analytics

---

## 🤝 Contributing

Pull requests are welcome.

1. Fork the repo  
2. Create your branch  
3. Commit changes  
4. Open a PR  

---

## 📄 License

MIT License

---

## 👤 Author

Developed by:  
**Kamal Tafesh**

---

## ⭐ Support

If you like this project:

- Star the repo ⭐  
- Share it 🤝  
