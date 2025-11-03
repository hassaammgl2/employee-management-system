import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationStore {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Employee Added",
    message: "Ali Khan has been added to HR department",
    date: new Date().toISOString(),
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Leave Request",
    message: "Sara Ahmed requested leave for next week",
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Profile Updated",
    message: "Your profile has been updated successfully",
    date: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    type: "success",
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance on Saturday 10 PM - 2 AM",
    date: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    type: "warning",
  },
  {
    id: "5",
    title: "Department Meeting",
    message: "Team meeting scheduled for tomorrow at 3 PM",
    date: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    type: "info",
  },
];

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: mockNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
