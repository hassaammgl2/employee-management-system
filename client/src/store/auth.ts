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
  }) => Promise<{ role: string }>;
  me: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    name: string;
    fatherName: string;
    password: string;
  }) => Promise<void>;
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
          set({ user: data.data, isAuthenticated: true });
        } catch (err: any) {
          const errorMessage = getErrorMessage(err);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      login: async ({ email, password, employeeCode }) => {
        try {
          set({ error: null });
          const { data } = await api.post("/login", {
            email,
            password,
            employeeCode,
          });
          set({ user: data.data, isAuthenticated: true });
          return { role: data.data?.role };
        } catch (err: any) {
          const errorMessage = getErrorMessage(err);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      me: async () => {
        try {
          const { data } = await api.get("/me");
          set({ user: data.data, isAuthenticated: true });
        } catch {
          try {
            await api.post("/refresh");
            const { data } = await api.get("/me");
            set({ user: data.data, isAuthenticated: true });
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
      updateProfile: async (updates) => {
        try {
          set({ error: null });
          const { data } = await api.post("/update-profile", { ...updates });
          set({ user: data.data, isAuthenticated: true });
        } catch (err: any) {
          const errorMessage = getErrorMessage(err);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
