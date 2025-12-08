export type Role = "admin" | "employee";

export type EmployeeStatus = "active" | "on_leave" | "terminated";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  employeeCode?: string;
  fatherName: string;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  fatherName: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  password?: string;
  status: EmployeeStatus;
  joinDate: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "half_day";
}
