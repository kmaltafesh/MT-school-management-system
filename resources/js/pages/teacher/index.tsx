import { type BreadcrumbItem } from "@/types";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

interface Teacher {
  id: number;
  tenant_id: number;
  name: string;
  specialization: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Teachers",
    href: "/teachers",
  },
];

const emptyForm = {
  name: "",
  specialization: "",
};

type FormState = typeof emptyForm & { id?: number };

export default function TeacherIndex() {
  const { teachers } = usePage<{ teachers?: Teacher[] }>().props;
  const teacherList = teachers ?? [];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Open add dialog
  const handleOpenAdd = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setOpen(true);
  };

  // Open edit dialog
  const handleOpenEdit = (teacher: Teacher) => {
    setForm({
      id: teacher.id,
      name: teacher.name,
      specialization: teacher.specialization,
    });
    setIsEdit(true);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setIsEdit(false);
  };

  // Update form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!form.name.trim() || !form.specialization.trim()) {
      alert("All fields are required");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEdit && form.id) {
        router.put(`/teachers/${form.id}`, form, {
          onSuccess: handleClose,
          onError: () => setLoading(false),
        });
      } else {
        router.post("/teachers", form, {
          onSuccess: handleClose,
          onError: () => setLoading(false),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  // Delete teacher
  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the teacher "${name}"?`
      )
    ) {
      router.delete(`/teachers/${id}`, {
        onError: (errors) => {
          console.error("Error deleting teacher:", errors);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 mt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Teachers</h1>
          <Button onClick={handleOpenAdd}>Add Teacher</Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm rounded-lg">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">ID</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Specialization</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {teacherList.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <td className="px-4 py-2">{teacher.id}</td>
                  <td className="px-4 py-2 font-medium">{teacher.name}</td>
                  <td className="px-4 py-2">{teacher.specialization}</td>

                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(teacher)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(teacher.id, teacher.name)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {teacherList.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Update Teacher" : "Add New Teacher"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter teacher name"
                disabled={loading}
              />
            </div>

            {/* Specialization Field */}
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Enter specialization"
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                    ? "Update"
                    : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}