import { create } from "zustand";
import type { Department } from "@/types";

interface DepartmentState {
  departments: Department[];
  addDepartment: (department: Omit<Department, "id">) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  resetDepartments: () => void;
}

// Mock data
const mockDepartments: Department[] = [
  {
    id: "dept-001",
    name: "Engineering",
    head: "Alice Johnson",
    employeeCount: 12,
    description: "Software development and technical operations",
  },
  {
    id: "dept-002",
    name: "Product",
    head: "Bob Wilson",
    employeeCount: 5,
    description: "Product strategy and management",
  },
  {
    id: "dept-003",
    name: "Design",
    head: "Carol Martinez",
    employeeCount: 4,
    description: "UI/UX and visual design",
  },
  {
    id: "dept-004",
    name: "Human Resources",
    head: "David Lee",
    employeeCount: 3,
    description: "Employee relations and recruitment",
  },
  {
    id: "dept-005",
    name: "Marketing",
    head: "Emma Thompson",
    employeeCount: 6,
    description: "Brand marketing and communications",
  },
];

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: mockDepartments,
  addDepartment: (department) =>
    set((state) => ({
      departments: [
        ...state.departments,
        { ...department, id: `dept-${Date.now()}` },
      ],
    })),
  updateDepartment: (id, updates) =>
    set((state) => ({
      departments: state.departments.map((dept) =>
        dept.id === id ? { ...dept, ...updates } : dept
      ),
    })),
  deleteDepartment: (id) =>
    set((state) => ({
      departments: state.departments.filter((dept) => dept.id !== id),
    })),
  resetDepartments: () => set({ departments: mockDepartments }),
}));
