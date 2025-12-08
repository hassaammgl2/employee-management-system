import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth";
import { useTaskStore } from "@/store/task";
import { useLeaveStore } from "@/store/leave";
import { useAnnouncementStore } from "@/store/announcement";
import { Calendar, CheckCircle2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, toggleTask } = useTaskStore();
  const { leaves, fetchMyLeaves } = useLeaveStore();
  const { announcements, fetchAnnouncements } = useAnnouncementStore();

  useEffect(() => {
    fetchTasks();
    fetchMyLeaves();
    fetchAnnouncements();
  }, [fetchTasks, fetchMyLeaves, fetchAnnouncements]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  const approvedLeaves = leaves.filter(l => l.status === "approved").length;
  const pendingLeaves = leaves.filter(l => l.status === "pending").length;
  const rejectedLeaves = leaves.filter(l => l.status === "rejected").length;
  const totalLeaves = leaves.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's your employee dashboard overview
        </p>
      </div>

      {/* Personal Info Card */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{(user as any).department || "N/A"}</p>
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
              Total Leaves
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLeaves}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaves}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingLeaves}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
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
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks assigned.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn("flex items-start gap-3 p-3 rounded-lg border", task.completed && "bg-muted/50")}
                >
                  <Checkbox checked={task.completed} onCheckedChange={(checked) => toggleTask(task.id, checked as boolean)} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={cn("font-medium text-sm", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                      <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>{task.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leave Summary & Announcements */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leave Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Approved</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{
                      width: `${totalLeaves ? (approvedLeaves / totalLeaves) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{approvedLeaves}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Rejected</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-destructive"
                    style={{
                      width: `${totalLeaves ? (rejectedLeaves / totalLeaves) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{rejectedLeaves}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-yellow-600"
                    style={{
                      width: `${totalLeaves ? (pendingLeaves / totalLeaves) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{pendingLeaves}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-muted-foreground text-sm">No announcements.</p>
            ) : (
              announcements.slice(0, 3).map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 rounded-lg border space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <Badge
                      variant={
                        announcement.priority === "high"
                          ? "destructive"
                          : announcement.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs capitalize"
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {announcement.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
