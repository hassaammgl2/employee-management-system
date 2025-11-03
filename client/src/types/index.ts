export type Role = "admin" | "employee";

export type EmployeeStatus = "active" | "on_leave" | "terminated";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  employeeId?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
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
  date: string;
  priority: "low" | "medium" | "high";
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "half_day";
}
