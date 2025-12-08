/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import type { Announcement } from "@/types";
import { getErrorMessage } from "@/utils/zustandError";

interface AnnouncementState {
    announcements: Announcement[];
    isLoading: boolean;
    error: string | null;
    fetchAnnouncements: () => Promise<void>;
    addAnnouncement: (announcement: Partial<Announcement>) => Promise<boolean>;
    updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<boolean>;
    deleteAnnouncement: (id: string) => Promise<boolean>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
    baseURL: API_BASE ? `${API_BASE}/api/announcements` : "/api/announcements",
    withCredentials: true,
});

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
    announcements: [],
    isLoading: false,
    error: null,

    fetchAnnouncements: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get("/");
            set({ isLoading: false, announcements: data.data });
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
        }
    },

    addAnnouncement: async (announcement) => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/", announcement);
            await get().fetchAnnouncements();
            set({ isLoading: false });
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    updateAnnouncement: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await api.patch(`/${id}`, updates);
            await get().fetchAnnouncements();
            set({ isLoading: false });
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            set((state) => ({
                announcements: state.announcements.filter((a) => a.id !== id),
            }));
            await api.delete(`/${id}`);
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage });
            await get().fetchAnnouncements(); // Revert on error
            return false;
        }
    },
}));
