// import { lazy } from "react";
// import { redirect } from "react-router";
// const LoginPage = lazy(() => import("@/pages/LoginPage"));
// const SignupPage = lazy(() => import("@/pages/SignupPage"));
// const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));
// const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
// import MySuspense from "./MySuspense";
// import AdminDashboard from "@/pages/admin/Dashboard";
// import EmployeePage from "@/pages/admin/EmployeePage";
// import DepartmentPage from "@/pages/admin/DepartmentPage";
// import LeavesPage from "@/pages/admin/LeavesPage";

// import Dashboard from "@/pages/employee/Dashboard";
// import ProfilePage from "@/pages/employee/ProfilePage";
// import EmployeeSettingsPage from "@/pages/employee/SettingsPage";

// const routes = [
//   {
//     path: "/",
//     loader: () => redirect("/login"),
//   },
//   {
//     path: "/login",
//     element: (
//       <MySuspense>
//         <LoginPage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/signup",
//     element: (
//       <MySuspense>
//         <SignupPage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/admin/dashboard",
//     element: (
//       <MySuspense>
//         <AdminDashboard />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/admin/employees",
//     element: (
//       <MySuspense>
//         <EmployeePage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/admin/departments",
//     element: (
//       <MySuspense>
//         <DepartmentPage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/admin/leaves",
//     element: (
//       <MySuspense>
//         <LeavesPage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/admin/settings",
//     element: <SettingsPage />,
//   },
//   {
//     path: "/employee/dashboard",
//     element: (
//       <MySuspense>
//         <Dashboard />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/employee/profile",
//     element: (
//       <MySuspense>
//         <ProfilePage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/employee/leave",
//     element: (
//       <MySuspense>
//         <LeavesPage />
//       </MySuspense>
//     ),
//   },
//   {
//     path: "/employee/settings",
//     element: <EmployeeSettingsPage />,
//   },
//   {
//     path: "*",
//     element: <NotFoundPage />,
//   },
// ];

// export default routes;

import { lazy } from "react";
import { redirect } from "react-router";
import MySuspense from "./MySuspense";
import AppLayout from "@/layouts/AppLayout";

// Layout
// import DashboardLayout from "@/layouts/DashboardLayout";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/pages/Login"));
// const SignupPage = lazy(() => import("@/pages/SignupPage"));
// const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const EmployeeManagement = lazy(() => import("@/pages/EmployeeManagement"));
const DepartmentPage = lazy(() => import("@/pages/Departments"));
const ReportsPage = lazy(() => import("@/pages/Reports"));
const NotificationsPage = lazy(() => import("@/pages/Notifications"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const ProfilePage = lazy(() => import("@/pages/Profile"));

// Employee Pages
const EmployeeDashboard = lazy(() => import("@/pages/EmployeeDashboard"));
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
  // {
  //   path: "/signup",
  //   element: (
  //     <MySuspense>
  //       <SignupPage />
  //     </MySuspense>
  //   ),
  // },
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
  // {
  //   path: "*",
  //   element: (
  //     <MySuspense>
  //       <NotFoundPage />
  //     </MySuspense>
  //   ),
  // },
];

export default routes;
