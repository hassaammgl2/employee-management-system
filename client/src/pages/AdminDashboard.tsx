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
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useEmployeeStore } from "@/store/employee";
import { useDepartmentStore } from "@/store/department";
import { useActivityStore } from "@/store/activity";


export default function AdminDashboard() {
  const { employees, fetchEmployees } = useEmployeeStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { activities, fetchActivities } = useActivityStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchActivities();
  }, [fetchEmployees, fetchDepartments, fetchActivities]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on_leave").length;
  const totalDepartments = departments.length;

  const chartData = departments.map((dept) => ({
    name: dept.name,
    employees: dept.employeeCount,
  }));

  const growthData = [
    { month: "Jan", employees: 45 },
    { month: "Feb", employees: 52 },
    { month: "Mar", employees: 58 },
    { month: "Apr", employees: 65 },
    { month: "May", employees: 72 },
    { month: "Jun", employees: totalEmployees },
  ];

  const attendanceData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 10 },
    { name: "On Leave", value: 5 },
  ];

  const stats = [
    { title: "Total Employees", value: totalEmployees, icon: Users },
    { title: "Active Employees", value: activeEmployees, icon: TrendingUp },
    { title: "On Leave", value: onLeave, icon: UserX },
    { title: "Departments", value: totalDepartments, icon: Building2 },
  ];

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add Employee",
      description: "Onboard a new team member",
      action: () => navigate("/admin/employees"),
    },
    {
      icon: CheckCircle,
      label: "Approve Leave",
      description: "Review pending leave requests",
      action: () => { },
    },
    {
      icon: Activity,
      label: "View Reports",
      description: "Access detailed analytics",
      action: () => navigate("/admin/reports"),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your organization's key metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Employee Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Employee Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance */}
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
                  paddingAngle={3}
                  dataKey="value"
                >
                  {attendanceData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "hsl(142 76% 36%)" : i === 1 ? "hsl(0 84% 60%)" : "hsl(48 96% 53%)"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {attendanceData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between"
                >
                  <span>{entry.name}</span>
                  <span className="font-medium">{entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Employees by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar
                  dataKey="employees"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {activities.slice(0, 6).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 border-b pb-3 last:border-none"
                >
                  <div className="h-2 w-2 rounded-full bg-muted flex-shrink-0 mt-2" />
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.action}
                className="h-auto flex flex-col items-start gap-2 p-4 hover:bg-accent/10 transition-colors"
              >
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Button>
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
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/5 transition-colors"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.role} • {employee.department}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium capitalize">{employee.status}</p>
                  <p className="text-muted-foreground">
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

