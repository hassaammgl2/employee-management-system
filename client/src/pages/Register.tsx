import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { Building2 } from "lucide-react";
import { motion as m } from "motion/react";
import type { AxiosError } from "axios";
import { useToast } from "@/components/ui/toast";

export default function Register() {
  const { error, success } = useToast();

  const [data, setData] = useState({
    name: "",
    fatherName: "",
    email: "",
    password: "",
  });
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, fatherName, password } = data;
    try {
      await register({ name, email, fatherName, password });
      success("Admin account created successfully! 🎉");
      navigate("/admin/dashboard");
    } catch (err) {
      const message =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ??
        (err as Error)?.message ??
        "Admin Register failed 😵";
      error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Employee Management System
          </CardTitle>
          <CardDescription>
            Sign up to create your admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                placeholder="Enter your father's name..."
                value={data.fatherName}
                onChange={(e) =>
                  setData({ ...data, fatherName: e.target.value })
                }
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </m.div>

            <Button onClick={handleSubmit} type="submit" className="w-full">
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div className="text-center">
              <p>
                Already have an admin account?{" "}
                <NavLink className={"ml-1 text-primary"} to={"/login"}>
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
