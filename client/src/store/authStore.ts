import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    role: "admin",
    password: "admin123",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@company.com",
    role: "employee",
    password: "employee123",
    employeeId: "emp-001",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password, role) => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password && u.role === role
        );
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
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
