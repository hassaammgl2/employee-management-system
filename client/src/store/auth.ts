/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  register: (payload: {
    name: string;
    fatherName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (payload: {
    email: string;
    password: string;
    employeeCode: string;
  }) => Promise<void>;
  me: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
});

const getErrorMessage = (err: any): string => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      error: null,
      user: null,
      isAuthenticated: false,

      register: async ({ email, fatherName, name, password }) => {
        try {
          set({ error: null });

          const { data } = await api.post("/register", {
            email,
            fatherName,
            name,
            password,
          });
          set({ user: data.user, isAuthenticated: true });
        } catch (err: any) {
          const errorMessage = getErrorMessage(err);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      login: async ({ email, password, employeeCode }) => {
        try {
          const { data } = await api.post("/login", {
            email,
            password,
            employeeCode,
          });
          const apiUser = data?.data as any;
          const user = apiUser
            ? ({
                id: apiUser._id ?? apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                employeeCode: apiUser.employeeCode ?? undefined,
                password: "",
              } as User)
            : null;
          set({ user, isAuthenticated: !!user });
          return true;
        } catch {
          return false;
        }
      },
      me: async () => {
        try {
          const { data } = await api.get("/me");
          const apiUser = data?.data as any;
          const user = apiUser
            ? ({
                id: apiUser._id ?? apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                employeeCode: apiUser.employeeCode ?? undefined,
                password: "",
              } as User)
            : null;
          set({ user, isAuthenticated: !!user });
        } catch {
          // try refresh once
          try {
            await api.post("/refresh");
            const { data } = await api.get("/me");
            const apiUser = data?.data as any;
            const user = apiUser
              ? ({
                  id: apiUser._id ?? apiUser.id,
                  name: apiUser.name,
                  email: apiUser.email,
                  role: apiUser.role,
                  employeeCode: apiUser.employeeCode ?? undefined,
                  password: "",
                } as User)
              : null;
            set({ user, isAuthenticated: !!user });
          } catch {
            set({ user: null, isAuthenticated: false });
          }
        }
      },
      logout: async () => {
        try {
          await api.post("/logout");
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
