import { create } from "zustand";

export interface Activity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: "employee" | "department" | "profile" | "leave";
}

interface ActivityStore {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    action: "Ali Khan added to HR",
    user: "Admin",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    type: "employee",
  },
  {
    id: "2",
    action: "Sara Ahmed updated profile",
    user: "Sara Ahmed",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    type: "profile",
  },
  {
    id: "3",
    action: "IT Department budget approved",
    user: "Admin",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    type: "department",
  },
  {
    id: "4",
    action: "Leave request approved for John Doe",
    user: "Admin",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: "leave",
  },
  {
    id: "5",
    action: "New department Finance created",
    user: "Admin",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "department",
  },
  {
    id: "6",
    action: "Employee Michael removed",
    user: "Admin",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: "employee",
  },
];

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: mockActivities,
  addActivity: (activity) =>
    set((state) => ({
      activities: [
        {
          ...activity,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        },
        ...state.activities,
      ],
    })),
}));
