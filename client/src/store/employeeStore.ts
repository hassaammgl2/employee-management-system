import { create } from "zustand";
import type { Employee } from "@/types";

interface EmployeeState {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  resetEmployees: () => void;
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "John Doe",
    email: "john@company.com",
    role: "Software Engineer",
    department: "Engineering",
    salary: 75000,
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: "emp-002",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "Product Manager",
    department: "Product",
    salary: 85000,
    status: "active",
    joinDate: "2022-06-10",
  },
  {
    id: "emp-003",
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "UX Designer",
    department: "Design",
    salary: 70000,
    status: "active",
    joinDate: "2023-03-20",
  },
  {
    id: "emp-004",
    name: "Sarah Williams",
    email: "sarah@company.com",
    role: "HR Manager",
    department: "Human Resources",
    salary: 65000,
    status: "on_leave",
    joinDate: "2021-09-05",
  },
  {
    id: "emp-005",
    name: "David Brown",
    email: "david@company.com",
    role: "Marketing Specialist",
    department: "Marketing",
    salary: 60000,
    status: "active",
    joinDate: "2023-07-12",
  },
];

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: mockEmployees,
  addEmployee: (employee) =>
    set((state) => ({
      employees: [
        ...state.employees,
        { ...employee, id: `emp-${Date.now()}` },
      ],
    })),
  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updates } : emp
      ),
    })),
  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),
  resetEmployees: () => set({ employees: mockEmployees }),
}));
