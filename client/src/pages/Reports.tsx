import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeStore } from "@/store/employee";
import { useDepartmentStore } from "@/store/department";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function Reports() {
  const { employees } = useEmployeeStore();
  const { departments } = useDepartmentStore();

  // Salary distribution by department
  const salaryByDept = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept.name);
    const avgSalary = deptEmployees.reduce((sum, e) => sum + e.salary, 0) / deptEmployees.length || 0;
    return {
      name: dept.name,
      avgSalary: Math.round(avgSalary),
      employees: deptEmployees.length,
    };
  });

  // Employee status distribution
  const statusData = [
    { name: "Active", value: employees.filter((e) => e.status === "active").length },
    { name: "On Leave", value: employees.filter((e) => e.status === "on_leave").length },
    { name: "Terminated", value: employees.filter((e) => e.status === "terminated").length },
  ];

  const STATUS_COLORS = ["hsl(142 76% 36%)", "hsl(48 96% 53%)", "hsl(0 84% 60%)"];

  // Department performance (mock)
  const performanceData = departments.map((dept) => ({
    department: dept.name,
    productivity: Math.floor(Math.random() * 30) + 70,
    satisfaction: Math.floor(Math.random() * 30) + 70,
    efficiency: Math.floor(Math.random() * 30) + 70,
  }));

  // Top earners
  const topEarners = [...employees]
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 5);

  const totalSalaryExpense = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = Math.round(totalSalaryExpense / employees.length);

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Average Salary",
      value: `$${avgSalary.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      title: "Total Departments",
      value: departments.length,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Monthly Expense",
      value: `$${totalSalaryExpense.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your organization
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Salary by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryByDept}>
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
                  tickFormatter={(value) => `$${value / 1000}k`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar
                  dataKey="avgSalary"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="department" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={12} />
                <Radar
                  name="Productivity"
                  dataKey="productivity"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Satisfaction"
                  dataKey="satisfaction"
                  stroke="hsl(142 76% 36%)"
                  fill="hsl(142 76% 36%)"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Earners</CardTitle>
            <Award className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarners.map((employee, index) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${index === 0 ? "bg-yellow-600/20 text-yellow-600" :
                      index === 1 ? "bg-muted text-muted-foreground" :
                        "bg-accent/20 text-accent"
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${employee.salary.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
