import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const EditDepartment = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      // onClick={() => handleOpenDialog(department)}
      // disabled={isLoading}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );
};

export default EditDepartment;
