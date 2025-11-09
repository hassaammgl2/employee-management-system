import { useState } from "react";
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
import { Plus } from "lucide-react";
import type { EmployeeStatus } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const AddEmployee = () => {
  const { addEmployee } = useEmployeeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const departments = ["HR", "Finance", "IT", "Marketing", "Operations"];

  const [data, setData] = useState({
    name: "",
    fatherName: "",
    email: "",
    password: "",
    role: "",
    department: "",
    salary: 0,
    status: "active" as EmployeeStatus,
  });

  const resetForm = () => {
    setData({
      name: "",
      fatherName: "",
      email: "",
      password: "",
      role: "",
      department: "",
      salary: 0,
      status: "active",
    });
    setDate(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      department,
      email,
      fatherName,
      name,
      password,
      role,
      salary,
      status,
    } = data;

    if (!name || !fatherName || !email || !password || !role || !department) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!date) {
      toast.error("Please select a join date!");
      return;
    }

    if (salary <= 0) {
      toast.error("Salary must be greater than zero!");
      return;
    }

    try {
      await addEmployee({
        department,
        email,
        fatherName,
        name,
        password,
        role,
        salary,
        joinDate: date.toISOString(),
        status,
      });

      toast.success(`${name} has been added successfully!`);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add employee. Try again!");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {/* Full Name */}
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

            {/* Father Name */}
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
            {/* Email */}
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

            {/* Password */}
            <div className="space-y-2 w-1/2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter employee password..."
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
                 {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              placeholder="Enter employee role..."
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              required
            />
          </div>

          {/* Salary */}
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
              {/* Department */}
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
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Status */}
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

            {/* Join Date */}
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

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Employee
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
