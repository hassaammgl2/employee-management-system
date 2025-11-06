/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import type { Department } from "@/types";
import { toast } from "@/hooks/use-toast";

interface DepartmentState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  addDepartment: (department: Omit<Department, "id">) => Promise<boolean>;
  updateDepartment: (id: string, updates: Partial<Department>) => Promise<boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;
  resetDepartments: () => void;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
});

// Helper function to transform API department to client Department
const transformDepartment = (apiDepartment: any): Department => {
  return {
    id: apiDepartment._id || apiDepartment.id,
    name: apiDepartment.name || "",
    head: apiDepartment.head || "",
    employeeCount: apiDepartment.employeeCount || 0,
    description: apiDepartment.description || "",
  };
};

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/departments");
      const departments = (data?.data || []).map(transformDepartment);
      set({ departments, isLoading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to fetch departments";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  addDepartment: async (department) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = {
        name: department.name,
        head: department.head || "",
        description: department.description || "",
        employeeCount: department.employeeCount || 0,
      };

      const { data } = await api.post("/departments", payload);
      const newDepartment = transformDepartment(data?.data);
      
      set((state) => ({
        departments: [...state.departments, newDepartment],
        isLoading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Department added successfully",
      });
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to add department";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  },

  updateDepartment: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.head !== undefined) payload.head = updates.head;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.employeeCount !== undefined) payload.employeeCount = updates.employeeCount;

      const { data } = await api.put(`/departments/${id}`, payload);
      const updatedDepartment = transformDepartment(data?.data);

      set((state) => ({
        departments: state.departments.map((dept) =>
          dept.id === id ? updatedDepartment : dept
        ),
        isLoading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Department updated successfully",
      });
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to update department";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  },

  deleteDepartment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/departments/${id}`);

      set((state) => ({
        departments: state.departments.filter((dept) => dept.id !== id),
        isLoading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to delete department";
      set({ isLoading: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  },

  resetDepartments: () => {
    set({ departments: [], error: null });
  },
}));
