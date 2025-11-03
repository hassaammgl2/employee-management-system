import { Search, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

export function Topbar() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 bg-secondary/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user ? getInitials(user.name) : <User size={18} />}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
