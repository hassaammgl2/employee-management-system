import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEmployeeStore } from "@/store/employee";
import { Search, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/Loader/spinner";
import AddEmployee from "@/components/forms/admin/AddEmployee";
import EditEmployee from "@/components/forms/admin/EditEmployee";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Employee as EmployeeType } from "@/types";

export default function EmployeeManagement() {
  const { employees, isLoading, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    (async () => {
      await fetchEmployees();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <AddEmployee />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Father's Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Spinner variant="ellipsis" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <EmployeeTable
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  fatherName={employee.fatherName}
                  email={employee.email}
                  role={employee.role}
                  department={employee.department}
                  salary={employee.salary}
                  status={employee.status}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const EmployeeTable = ({
  id,
  name,
  fatherName,
  email,
  role,
  department,
  salary,
  status,
}: Partial<EmployeeType>) => {
  return (
    <TableRow key={id}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{fatherName}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>{department}</TableCell>
      <TableCell>${salary?.toLocaleString()}</TableCell>
      <TableCell>
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "on_leave"
              ? "secondary"
              : "destructive"
          }
        >
          {status?.replace("_", " ").toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditEmployee />
          <DeleteEmployee />
        </div>
      </TableCell>
    </TableRow>
  );
};

const DeleteEmployee = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};
