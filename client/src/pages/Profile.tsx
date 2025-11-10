import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { User, Mail, Shield, UserCircle2Icon, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import type { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const { error, success } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [data, setData] = useState({
    name: user?.name || "",
    fatherName: user?.fatherName || "",
    email: user?.email || "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsOpen(false);
      await updateProfile({
        name: data.name,
        password: data.password,
        fatherName: data.fatherName,
      });
      success("Your profile updated 🎉");
    } catch (err) {
      const message =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ??
        (err as Error)?.message ??
        "Failed to update profile 😵";
      error(message);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Father Name</Label>
              <div className="relative">
                <UserCircle2Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={data.fatherName}
                  onChange={(e) =>
                    setData({ ...data, fatherName: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  disabled
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="role"
                  value={user?.role === "admin" ? "Administrator" : "Employee"}
                  className="pl-9"
                  disabled
                />
              </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Save Changes</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter your password.</DialogTitle>
                  <DialogDescription>
                    This action will change your account details
                  </DialogDescription>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="password"
                        value={data.password}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4 flex justify-end">
                    <Button onClick={handleSubmit}>Submit</Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Account Type</span>
            <span className="font-medium">
              {user?.role === "admin" ? "Administrator" : "Employee"}
            </span>
          </div>

          {user?.employeeCode && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {user?.role === "admin" ? "Admin" : "Employee"} Code
              </span>
              <span className="font-mono text-sm">{user.employeeCode}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
