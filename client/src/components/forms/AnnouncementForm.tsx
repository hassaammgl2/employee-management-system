import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAnnouncementStore } from "@/store/announcement";
import { useToast } from "@/hooks/use-toast";
import type { Announcement } from "@/types";

interface AnnouncementFormProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement;
}

const AnnouncementForm = ({ isOpen, onClose, announcement }: AnnouncementFormProps) => {
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        priority: "medium",
        isActive: true,
    });

    const { addAnnouncement, updateAnnouncement, isLoading } = useAnnouncementStore();
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (announcement) {
                setFormData({
                    title: announcement.title,
                    message: announcement.message,
                    priority: announcement.priority,
                    isActive: announcement.isActive,
                });
            } else {
                setFormData({
                    title: "",
                    message: "",
                    priority: "medium",
                    isActive: true,
                });
            }
        }
    }, [isOpen, announcement]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let success = false;
        if (announcement) {
            success = await updateAnnouncement(announcement.id, formData as any);
        } else {
            success = await addAnnouncement(formData as any);
        }

        if (success) {
            toast({
                title: "Success",
                description: announcement
                    ? "Announcement updated successfully"
                    : "Announcement created successfully",
            });
            onClose();
        } else {
            toast({
                title: "Error",
                description: announcement
                    ? "Failed to update announcement"
                    : "Failed to create announcement",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {announcement ? "Edit Announcement" : "Create New Announcement"}
                    </DialogTitle>
                    <DialogDescription>
                        {announcement
                            ? "Update announcement details."
                            : "Fill in the details to create a new announcement."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                            disabled={isLoading}
                            placeholder="e.g., Office Closure Notice"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value) =>
                                setFormData({ ...formData, priority: value })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            rows={5}
                            required
                            disabled={isLoading}
                            placeholder="Detailed announcement message..."
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading
                                ? "Saving..."
                                : announcement
                                    ? "Update Announcement"
                                    : "Create Announcement"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AnnouncementForm;
