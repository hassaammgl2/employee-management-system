/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import type { Employee } from "@/types";
import { toast } from "@/hooks/use-toast";

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, "id"> & { fatherName?: string; password?: string }) => Promise<boolean>;
  updateEmployee: (id: string, updates: Partial<Employee> & { fatherName?: string }) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  resetEmployees: () => void;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
});

// Helper function to transform API employee to client Employee
const transformEmployee = (apiEmployee: any): Employee => {
  return {
    id: apiEmployee._id || apiEmployee.id,
    name: apiEmployee.name || "",
    fatherName: apiEmployee.fatherName || "",
    email: apiEmployee.email || "",
    role: apiEmployee.role || "",
    department: apiEmployee.department || "",
    salary: apiEmployee.salary || 0,
    status: apiEmployee.status || "active",
    joinDate: apiEmployee.joinDate || new Date().toISOString().split("T")[0],
    avatar: apiEmployee.avatar || undefined,
  };
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/employees");
      const employees = (data?.data || []).map(transformEmployee);
      set({ employees, isLoading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to fetch employees";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  addEmployee: async (employee) => {
    set({ isLoading: true, error: null });
    try {
      // Transform client employee data to API format
      // Generate a secure temporary password that meets validation requirements
      const generateTempPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
        let password = "";
        // Ensure at least one of each required character type
        password += "A"; // uppercase
        password += "a"; // lowercase
        password += "1"; // number
        password += "@"; // special char
        // Add random characters to meet minimum length
        for (let i = 0; i < 4; i++) {
          password += chars[Math.floor(Math.random() * chars.length)];
        }
        // Shuffle the password
        return password.split("").sort(() => Math.random() - 0.5).join("");
      };

      const payload: any = {
        name: employee.name,
        fatherName: employee.fatherName || "",
        email: employee.email,
        password: employee.password || generateTempPassword(),
        roleTitle: employee.role,
        department: employee.department,
        salary: employee.salary,
        status: employee.status || "active",
        joinDate: employee.joinDate || new Date().toISOString().split("T")[0],
      };
      if (employee.avatar) {
        payload.avatar = employee.avatar;
      }

      const { data } = await api.post("/employees", payload);
      const newEmployee = transformEmployee(data?.data);
      
      set((state) => ({
        employees: [...state.employees, newEmployee],
        isLoading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to add employee";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  },

  updateEmployee: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Transform client employee updates to API format
      const payload: any = {};
      if (updates.name) payload.name = updates.name;
      if (updates.fatherName) payload.fatherName = updates.fatherName;
      if (updates.email) payload.email = updates.email;
      if (updates.role) payload.roleTitle = updates.role;
      if (updates.department) payload.department = updates.department;
      if (updates.salary !== undefined) payload.salary = updates.salary;
      if (updates.status) payload.status = updates.status;
      if (updates.joinDate) payload.joinDate = updates.joinDate;
      if (updates.avatar !== undefined) payload.avatar = updates.avatar;

      const { data } = await api.put(`/employees/${id}`, payload);
      const updatedEmployee = transformEmployee(data?.data);

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.id === id ? updatedEmployee : emp
        ),
        isLoading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to update employee";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/employees/${id}`);

      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        isLoading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to delete employee";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  },

  resetEmployees: () => {
    set({ employees: [], error: null });
  },
}));
