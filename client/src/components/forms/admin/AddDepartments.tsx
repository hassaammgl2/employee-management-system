// import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { useDepartmentStore } from "@/store/department";
import {
  Plus,
  //  Pencil, Trash2, Users
} from "lucide-react";

const AddDepartments = () => {
  return (
    <Dialog
    //  open={isDialogOpen}
    //   onOpenChange={setIsDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
        //  onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new department.
          </DialogDescription>
        </DialogHeader>
        <form
          //  onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              // value={formData.name}
              // onChange={(e) =>
              //   setFormData({ ...formData, name: e.target.value })
              // }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="head">Department Head</Label>
            <Input
              id="head"
              // value={formData.head}
              // onChange={(e) =>
              //   setFormData({ ...formData, head: e.target.value })
              // }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeCount">Employee Count</Label>
            <Input
              id="employeeCount"
              type="number"
              min="0"
              // value={formData.employeeCount}
              // onChange={(e) =>
              //   setFormData({ ...formData, employeeCount: e.target.value })
              // }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              // value={formData.description}
              // onChange={(e) =>
              //   setFormData({ ...formData, description: e.target.value })
              // }
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Department
            </Button>
            <Button
              type="button"
              variant="outline"
              // onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartments;
