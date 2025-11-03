// import { SidebarProvider } from "@/components/ui/sidebar";
import {Topbar} from "./Topbar";
import {Sidebar} from "./Sidebar";
import { Outlet, Navigate } from "react-router";
// import { ModeToggle } from "@/components/mode-toggle";

const AppLayout = () => {
  //  const { isAuthenticated } = useAuthStore();
   const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
