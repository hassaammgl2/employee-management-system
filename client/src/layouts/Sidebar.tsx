import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { notifications } = useNotificationStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/employees", icon: Users, label: "Employees" },
    { to: "/admin/departments", icon: Building2, label: "Departments" },
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
    {
      to: "/employee/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
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
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        <Menu size={20} />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-sidebar-border",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {!collapsed && (
              <h1 className="text-xl font-bold text-sidebar-primary">EMS</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <link.icon size={20} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{link.label}</span>
                    {link.badge && link.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {link.badge}
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-sidebar-border p-3">
            {!collapsed && (
              <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
                <p className="text-sm font-medium text-sidebar-accent-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {user?.role === "admin" ? "Administrator" : "Employee"}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
