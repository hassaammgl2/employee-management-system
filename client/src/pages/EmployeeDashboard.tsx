import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/authStore";
import { useEmployeeStore } from "@/store/employeeStore";
import { useTaskStore } from "@/store/taskStore";
import { Calendar, DollarSign, Briefcase, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { tasks, toggleTask } = useTaskStore();

  // Find current employee's data
  const currentEmployee = employees.find((e) => e.email === user?.email);

  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  // const upcomingHolidays = [
  //   { id: "1", name: "New Year", date: "2025-01-01" },
  //   { id: "2", name: "Independence Day", date: "2025-08-14" },
  //   { id: "3", name: "Labor Day", date: "2025-05-01" },
  // ];

  // Generate attendance calendar (mock - 30 days)
  // const attendanceCalendar = Array.from({ length: 30 }, (_, i) => ({
  //   day: i + 1,
  //   status: Math.random() > 0.15 ? (Math.random() > 0.1 ? "present" : "half") : "absent"
  // }));

  const announcements = [
    {
      id: "1",
      title: "Team Building Event",
      message: "Join us for a team building event this Friday at 4 PM",
      date: "2024-01-15",
      priority: "medium" as const,
    },
    {
      id: "2",
      title: "System Maintenance",
      message: "Scheduled maintenance on Saturday from 10 PM to 2 AM",
      date: "2024-01-14",
      priority: "high" as const,
    },
    {
      id: "3",
      title: "Holiday Notice",
      message: "Office will be closed on Monday for the public holiday",
      date: "2024-01-13",
      priority: "low" as const,
    },
  ];

  const attendanceStats = {
    present: 18,
    absent: 1,
    halfDay: 2,
    total: 21,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's your employee dashboard overview
        </p>
      </div>

      {/* Personal Info Card */}
      {currentEmployee && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{currentEmployee.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{currentEmployee.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{currentEmployee.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    currentEmployee.status === "active"
                      ? "default"
                      : currentEmployee.status === "on_leave"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {currentEmployee.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Join Date
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentEmployee && new Date(currentEmployee.joinDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Salary
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentEmployee?.salary.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Department
            </CardTitle>
            <Briefcase className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentEmployee?.department}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance
            </CardTitle>
            <Bell className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceStats.present}/{attendanceStats.total}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section - placed before old attendance section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{tasks.length} completed
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn("flex items-start gap-3 p-3 rounded-lg border", task.completed && "bg-muted/50")}
              >
                <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn("font-medium text-sm", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                    <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>{task.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance & Announcements */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Present Days</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-success"
                    style={{
                      width: `${(attendanceStats.present / attendanceStats.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{attendanceStats.present}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Absent Days</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-destructive"
                    style={{
                      width: `${(attendanceStats.absent / attendanceStats.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{attendanceStats.absent}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Half Days</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-warning"
                    style={{
                      width: `${(attendanceStats.halfDay / attendanceStats.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{attendanceStats.halfDay}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{announcement.title}</h3>
                  <Badge
                    variant={
                      announcement.priority === "high"
                        ? "destructive"
                        : announcement.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {announcement.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
