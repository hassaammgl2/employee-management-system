import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  UserX,
  TrendingUp,
  UserPlus,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { useEmployeeStore } from "@/store/employeeStore";
import { useDepartmentStore } from "@/store/departmentStore";
import { useActivityStore } from "@/store/activityStore";
import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const { employees } = useEmployeeStore();
  const { departments } = useDepartmentStore();
  const { activities } = useActivityStore();
  const navigate = useNavigate();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on_leave").length;
  const totalDepartments = departments.length;

  // Department chart data
  const chartData = departments.map((dept) => ({
    name: dept.name,
    employees: dept.employeeCount,
  }));

  // Employee growth data (mock)
  const growthData = [
    { month: "Jan", employees: 45 },
    { month: "Feb", employees: 52 },
    { month: "Mar", employees: 58 },
    { month: "Apr", employees: 65 },
    { month: "May", employees: 72 },
    { month: "Jun", employees: totalEmployees },
  ];

  // Attendance rate data (mock)
  const attendanceData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 10 },
    { name: "On Leave", value: 5 },
  ];

  const COLORS = [
    "hsl(var(--success))",
    "hsl(var(--destructive))",
    "hsl(var(--warning))",
  ];

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "On Leave",
      value: onLeave,
      icon: UserX,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add Employee",
      description: "Onboard a new team member",
      action: () => navigate("/admin/employees"),
      color: "text-primary",
    },
    {
      icon: CheckCircle,
      label: "Approve Leave",
      description: "Review pending leave requests",
      action: () => {},
      color: "text-success",
    },
    {
      icon: Activity,
      label: "View Reports",
      description: "Access detailed analytics",
      action: () => navigate("/admin/reports"),
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your organization's key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Employee Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {attendanceData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{entry.name} </span>
                  </div>
                  <span className="font-medium">{entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar
                  dataKey="employees"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {activities.slice(0, 6).map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b last:border-0"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      activity.type === "employee"
                        ? "bg-primary"
                        : activity.type === "department"
                        ? "bg-accent"
                        : activity.type === "leave"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <div
                key={action.label}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={action.action}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <div className="text-left">
                    <h3 className="font-medium">{action.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.slice(0, 5).map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.role} • {employee.department}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{employee.status}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(employee.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
