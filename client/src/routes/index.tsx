import { lazy } from "react";
import { redirect } from "react-router";
import MySuspense from "./MySuspense";
import AppLayout from "@/layouts/AppLayout";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/pages/Login"));
const SignupPage = lazy(() => import("@/pages/Register"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Admin Pages
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminTasksPage = lazy(() => import("@/pages/AdminTasks"));
const AdminAnnouncementsPage = lazy(() => import("@/pages/AdminAnnouncements"));
const EmployeeManagement = lazy(() => import("@/pages/EmployeeManagement"));
const DepartmentPage = lazy(() => import("@/pages/Departments"));
const ReportsPage = lazy(() => import("@/pages/Reports"));
const NotificationsPage = lazy(() => import("@/pages/Notifications"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const ProfilePage = lazy(() => import("@/pages/Profile"));

// Employee Pages
const EmployeeDashboard = lazy(() => import("@/pages/EmployeeDashboard"));
const EmployeeTasksPage = lazy(() => import("@/pages/EmployeeTasks"));
const EmployeeNotificationsPage = lazy(() => import("@/pages/Notifications"));
const EmployeeSettingsPage = lazy(() => import("@/pages/Settings"));
const EmployeeProfilePage = lazy(() => import("@/pages/Profile"));

const routes = [
  {
    path: "/",
    loader: () => redirect("/login"),
  },
  {
    path: "/login",
    element: (
      <MySuspense>
        <LoginPage />
      </MySuspense>
    ),
  },
  {
    path: "/register",
    element: (
      <MySuspense>
        <SignupPage />
      </MySuspense>
    ),
  },
  {
    element: <AppLayout />,
    children: [
      // Admin Routes
      {
        path: "/admin/dashboard",
        element: (
          <MySuspense>
            <AdminDashboard />
          </MySuspense>
        ),
      },
      {
        path: "/admin/tasks",
        element: (
          <MySuspense>
            <AdminTasksPage />
          </MySuspense>
        ),
      },
      {
        path: "/admin/employees",
        element: (
          <MySuspense>
            <EmployeeManagement />
          </MySuspense>
        ),
      },
      {
        path: "/admin/departments",
        element: (
          <MySuspense>
            <DepartmentPage />
          </MySuspense>
        ),
      },
      {
        path: "/admin/announcements",
        element: (
          <MySuspense>
            <AdminAnnouncementsPage />
          </MySuspense>
        ),
      },
      {
        path: "/admin/reports",
        element: (
          <MySuspense>
            <ReportsPage />
          </MySuspense>
        ),
      },
      {
        path: "/admin/notifications",
        element: (
          <MySuspense>
            <NotificationsPage />
          </MySuspense>
        ),
      },
      {
        path: "/admin/settings",
        element: (
          <MySuspense>
            <SettingsPage />
          </MySuspense>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <MySuspense>
            <ProfilePage />
          </MySuspense>
        ),
      },

      // Employee Routes
      {
        path: "/employee/dashboard",
        element: (
          <MySuspense>
            <EmployeeDashboard />
          </MySuspense>
        ),
      },
      {
        path: "/employee/tasks",
        element: (
          <MySuspense>
            <EmployeeTasksPage />
          </MySuspense>
        ),
      },
      {
        path: "/employee/notifications",
        element: (
          <MySuspense>
            <EmployeeNotificationsPage />
          </MySuspense>
        ),
      },
      {
        path: "/employee/settings",
        element: (
          <MySuspense>
            <EmployeeSettingsPage />
          </MySuspense>
        ),
      },
      {
        path: "/employee/profile",
        element: (
          <MySuspense>
            <EmployeeProfilePage />
          </MySuspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <MySuspense>
        <NotFoundPage />
      </MySuspense>
    ),
  },
];

export default routes;
