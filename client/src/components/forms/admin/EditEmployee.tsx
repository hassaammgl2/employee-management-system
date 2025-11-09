import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmployeeStore } from "@/store/employee";
import { useDepartmentStore } from "@/store/department";
import { Calendar } from "@/components/ui/calendar";
import { Pencil } from "lucide-react";
import type { EmployeeStatus } from "@/types";

const EditEmployee = () => {
  const { fetchEmployees } = useEmployeeStore();
  const { departments } = useDepartmentStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [data, setData] = useState({
    name: "",
    fatherName: "",
    email: "",
    role: "",
    department: "",
    salary: 0,
    status: "active" as EmployeeStatus,
  });

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update the employee information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter employee full name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 w-1/2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                placeholder="Enter employee father's name"
                value={data.fatherName}
                onChange={(e) =>
                  setData({ ...data, fatherName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter employee email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 w-1/2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="Enter employee role..."
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Enter employee salary..."
                  value={data.salary}
                  onChange={(e) =>
                    setData({ ...data, salary: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={data.department}
                  onValueChange={(value) =>
                    setData({ ...data, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={data.status}
                  onValueChange={(value) =>
                    setData({ ...data, status: value as EmployeeStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border p-2"
                defaultMonth={new Date()}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Update Employee
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
  );
};

export default EditEmployee;
