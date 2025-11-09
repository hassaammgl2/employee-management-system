import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartmentStore } from "@/store/department";
import { Trash2, Users } from "lucide-react";
import type { Department as DepartmentType } from "@/types";
import { Spinner } from "@/components/ui/Loader/spinner";
import AddDepartments from "@/components/forms/admin/AddDepartments";
import EditDepartment from "@/components/forms/admin/EditDepartment";

export default function Departments() {
  const {
    departments,
    isLoading,
    fetchDepartments,
    // addDepartment,
    // updateDepartment,
    // deleteDepartment,
  } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [editingDept, setEditingDept] = useState<Department | null>(null);

  // const [formData, setFormData] = useState({
  //   name: "",
  //   head: "",
  //   employeeCount: "",
  //   description: "",
  // });

  // const handleOpenDialog = (department?: Department) => {
  //   if (department) {
  //     setEditingDept(department);
  //     setFormData({
  //       name: department.name,
  //       head: department.head,
  //       employeeCount: department.employeeCount.toString(),
  //       description: department.description,
  //     });
  //   } else {
  //     setEditingDept(null);
  //     setFormData({
  //       name: "",
  //       head: "",
  //       employeeCount: "0",
  //       description: "",
  //     });
  //   }
  //   setIsDialogOpen(true);
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // const deptData = {
  //   //   name: formData.name,
  //   //   head: formData.head,
  //   //   employeeCount: parseInt(formData.employeeCount),
  //   //   description: formData.description,
  //   // };

  //   // let success = false;
  //   // if (editingDept) {
  //   //   success = await updateDepartment(editingDept.id, deptData);
  //   // } else {
  //   //   success = await addDepartment(deptData);
  //   // }

  //   // if (success) {
  //   //   setIsDialogOpen(false);
  //   // }
  // };

  // const handleDelete = async (department: Department) => {
  //   if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
  //     await deleteDepartment(department.id);
  //   }
  // };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments
          </p>
        </div>

        <AddDepartments />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Spinner variant="ellipsis" />
          </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No departments found
          </div>
        ) : (
          departments.map((department) => (
            <DepartmentCards
              key={department.id}
              id={department.id}
              name={department.name}
              head={department.head}
              description={department.description}
              employeeCount={department.employeeCount}
            />
          ))
        )}
      </div>
    </div>
  );
}

const DepartmentCards = ({
  id,
  name,
  head,
  description,
  employeeCount,
}: DepartmentType) => {
  return (
    <Card className="hover:shadow-lg transition-shadow" key={id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <div className="flex gap-1">
          <EditDepartment />
          <Button
            variant="ghost"
            size="icon"
            // onClick={() => handleDelete(department)}
            // disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Department Head</p>
          <p className="font-medium">{head || "Not assigned"}</p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {employeeCount} {employeeCount === 1 ? "Employee" : "Employees"}
          </span>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {description || "No description"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
