import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnnouncementStore } from "@/store/announcement";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/Loader/spinner";
import AnnouncementForm from "@/components/forms/AnnouncementForm";
import { useToast } from "@/hooks/use-toast";
import type { Announcement } from "@/types";

export default function AdminAnnouncements() {
    const { announcements, isLoading, error, fetchAnnouncements, deleteAnnouncement } =
        useAnnouncementStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | undefined>(
        undefined
    );
    const { toast } = useToast();

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleCreate = () => {
        setEditingAnnouncement(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            const success = await deleteAnnouncement(id);
            if (success) {
                toast({
                    title: "Success",
                    description: "Announcement deleted successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete announcement",
                    variant: "destructive",
                });
            }
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "destructive";
            case "medium":
                return "default";
            case "low":
                return "secondary";
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Announcements</h1>
                    <p className="text-muted-foreground">
                        Create and manage company-wide announcements.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Announcement
                </Button>
            </div>

            {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : announcements.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                            No announcements yet. Create one to get started.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between pb-3">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                        <Badge
                                            variant={getPriorityColor(announcement.priority) as any}
                                            className="capitalize"
                                        >
                                            {announcement.priority}
                                        </Badge>
                                        {!announcement.isActive && (
                                            <Badge variant="outline">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        By {announcement.createdBy.name} •{" "}
                                        {format(new Date(announcement.createdAt), "PPP")}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(announcement)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(announcement.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {announcement.message}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AnnouncementForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                announcement={editingAnnouncement}
            />
        </div>
    );
}
