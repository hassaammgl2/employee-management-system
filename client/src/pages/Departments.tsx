import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDepartmentStore } from "@/store/departmentStore";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Department } from "@/types";

export default function Departments() {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartmentStore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    employeeCount: "",
    description: "",
  });

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setEditingDept(department);
      setFormData({
        name: department.name,
        head: department.head,
        employeeCount: department.employeeCount.toString(),
        description: department.description,
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: "",
        head: "",
        employeeCount: "0",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deptData = {
      name: formData.name,
      head: formData.head,
      employeeCount: parseInt(formData.employeeCount),
      description: formData.description,
    };

    if (editingDept) {
      updateDepartment(editingDept.id, deptData);
      toast({
        title: "Department updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      addDepartment(deptData);
      toast({
        title: "Department added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (department: Department) => {
    deleteDepartment(department.id);
    toast({
      title: "Department deleted",
      description: `${department.name} has been removed.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDept ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription>
                {editingDept
                  ? "Update department information"
                  : "Fill in the details to add a new department"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="head">Department Head</Label>
                <Input
                  id="head"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingDept ? "Update" : "Add"} Department
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{department.name}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDialog(department)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(department)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Department Head</p>
                <p className="font-medium">{department.head}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {department.employeeCount} {department.employeeCount === 1 ? "Employee" : "Employees"}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{department.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
