// import { NavLink } from "react-router";
// import {
//   LayoutDashboard,
//   Users,
//   Building2,
//   FileText,
//   Bell,
//   Settings,
//   UserCircle,
//   LogOut,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useAuthStore } from "@/store/auth";
// import { useNotificationStore } from "@/store/notification";
// import {
//   Sidebar as Bar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { Tooltip } from "@/components/ui/tooltip";

// export function Sidebar() {
//   const { user, logout } = useAuthStore();
//   const { notifications } = useNotificationStore();
//   const { open } = useSidebar(); // true = expanded, false = collapsed

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const adminLinks = [
//     { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
//     { to: "/admin/employees", icon: Users, label: "Employees" },
//     { to: "/admin/departments", icon: Building2, label: "Departments" },
//     { to: "/admin/reports", icon: FileText, label: "Reports" },
//     {
//       to: "/admin/notifications",
//       icon: Bell,
//       label: "Notifications",
//       badge: unreadCount,
//     },
//     { to: "/admin/settings", icon: Settings, label: "Settings" },
//     { to: "/admin/profile", icon: UserCircle, label: "Profile" },
//   ];

//   const employeeLinks = [
//     { to: "/employee/dashboard", icon: LayoutDashboard, label: "Dashboard" },
//     {
//       to: "/employee/notifications",
//       icon: Bell,
//       label: "Notifications",
//       badge: unreadCount,
//     },
//     { to: "/employee/settings", icon: Settings, label: "Settings" },
//     { to: "/employee/profile", icon: UserCircle, label: "Profile" },
//   ];

//   const links = user?.role === "admin" ? adminLinks : employeeLinks;

//   return (
//     <Bar collapsible="icon" variant="floating">
//       <SidebarHeader className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
//         {open && (
//           <h1 className="text-2xl font-bold text-sidebar-primary">EMS</h1>
//         )}
//       </SidebarHeader>

//       <SidebarContent className="flex-1 space-y-1 p-3 overflow-y-auto">
//         {links.map((link) => (
//           <NavLink
//             key={link.to}
//             to={link.to}
//             className={({ isActive }) =>
//               cn(
//                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
//                 isActive
//                   ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                   : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//               )
//             }
//           >
//             <Tooltip>
//               <link.icon size={20} />
//             </Tooltip>
//             {open && (
//               <>
//                 <span className="flex-1">{link.label}</span>
//                 {link.badge && link.badge > 0 && (
//                   <Badge
//                     variant="destructive"
//                     className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs"
//                   >
//                     {link.badge}
//                   </Badge>
//                 )}
//               </>
//             )}
//           </NavLink>
//         ))}
//       </SidebarContent>

//       <SidebarFooter className="border-t border-sidebar-border p-3">
//         {open && (
//           <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
//             <p className="text-sm font-medium text-sidebar-accent-foreground">
//               {user?.name || "User"}
//             </p>
//             <p className="text-xs text-sidebar-foreground/60 capitalize">
//               {user?.role || "employee"}
//             </p>
//           </div>
//         )}

//         <Button
//           variant="ghost"
//           onClick={logout}
//           className={cn(
//             "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//             !open && "justify-center"
//           )}
//         >
//           <LogOut size={20} />
//           {open && <span className="ml-3">Logout</span>}
//         </Button>
//       </SidebarFooter>
//     </Bar>
//   );
// }

import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Bell,
  Settings,
  UserCircle,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { useNotificationStore } from "@/store/notification";
import {
  Sidebar as Bar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { notifications } = useNotificationStore();
  const { open } = useSidebar(); // true = expanded, false = collapsed

  const unreadCount = notifications.filter((n) => !n.read).length;

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/admin/employees", icon: Users, label: "Employees" },
    { to: "/admin/departments", icon: Building2, label: "Departments" },
    { to: "/admin/announcements", icon: Bell, label: "Announcements" },
    { to: "/admin/reports", icon: FileText, label: "Reports" },
    {
      to: "/admin/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadCount,
    },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
    { to: "/admin/profile", icon: UserCircle, label: "Profile" },
  ];

  const employeeLinks = [
    { to: "/employee/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/employee/tasks", icon: ClipboardList, label: "My Tasks" },
    {
      to: "/employee/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadCount,
    },
    { to: "/employee/settings", icon: Settings, label: "Settings" },
    { to: "/employee/profile", icon: UserCircle, label: "Profile" },
  ];

  const links = user?.role === "admin" ? adminLinks : employeeLinks;

  return (
    <Bar collapsible="icon" variant="floating">
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        {open && (
          <h1 className="text-2xl font-bold text-sidebar-primary">EMS</h1>
        )}
      </SidebarHeader>

      <SidebarContent className="flex-1 space-y-1 p-3 overflow-y-auto">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <link.icon size={20} />
                  {open && (
                    <>
                      <span className="flex-1">{link.label}</span>
                      {link.badge && link.badge > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {open && (
          <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
            <p className="text-sm font-medium text-sidebar-accent-foreground">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.role || "employee"}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            !open && "justify-center"
          )}
        >
          <LogOut size={20} />
          {open && <span className="ml-3">Logout</span>}
        </Button>
      </SidebarFooter>
    </Bar>
  );
}
