import { create } from "zustand";
import axiosInstance from "../utils/axios.ts";
import type { User } from "@/types";

export interface Message {
    _id: string;
    conversation: string;
    sender: User | string; // Populated or ID
    content: string;
    createdAt: string;
}

export interface Department {
    _id: string;
    name: string;
}

export interface Teacher { // Reuse Employee/User type effectively
    _id: string;
    name: string;
    avatar?: string;
    email: string;
}

export interface Conversation {
    _id: string;
    name?: string;
    isGroup: boolean;
    members: User[];
    department?: {
        _id: string;
        name: string;
    };
    lastMessage?: Message;
    updatedAt: string;
}

interface ChatState {
    conversations: Conversation[];
    activeChat: Conversation | null;
    messages: Message[];
    isLoadingChats: boolean;
    isLoadingMessages: boolean;
    error: string | null;
    departments: Department[];
    availableEmployees: User[];
    isLoadingDepartments: boolean;
    isLoadingEmployees: boolean;

    fetchChats: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    setActiveChat: (chat: Conversation) => void;
    sendMessage: (content: string) => Promise<void>;
    startDM: (userId: string) => Promise<void>;

    // Real-time actions
    addMessage: (message: Message) => void;

    // Selection actions
    fetchDepartments: () => Promise<void>;
    fetchAvailableEmployees: (departmentId: string) => Promise<void>;
    clearAvailableEmployees: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeChat: null,
    messages: [],
    isLoadingChats: false,
    isLoadingMessages: false,
    error: null,
    departments: [],
    availableEmployees: [],
    isLoadingDepartments: false,
    isLoadingEmployees: false,

    fetchChats: async () => {
        set({ isLoadingChats: true });
        try {
            const { data } = await axiosInstance.get("/chat");
            set({ conversations: data.data, isLoadingChats: false });
        } catch (error) {
            set({ error: "Failed to fetch chats", isLoadingChats: false });
        }
    },

    fetchMessages: async (conversationId: string) => {
        set({ isLoadingMessages: true, messages: [] });
        try {
            const { data } = await axiosInstance.get(`/chat/${conversationId}/messages`);
            set({ messages: data.data, isLoadingMessages: false });
        } catch (error) {
            set({ error: "Failed to fetch messages", isLoadingMessages: false });
        }
    },

    setActiveChat: (chat: Conversation) => {
        set({ activeChat: chat });
        get().fetchMessages(chat._id);
    },

    sendMessage: async (content: string) => {
        const { activeChat } = get();
        if (!activeChat) return;

        try {
            const { data } = await axiosInstance.post(`/chat/${activeChat._id}/messages`, {
                content,
            });
            // Optimistic update or wait for socket?
            // Better wait for socket or response. Response is safer for ID.
            get().addMessage(data.data);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    },

    startDM: async (userId: string) => {
        try {
            const { data } = await axiosInstance.post("/chat/dm", { targetUserId: userId });
            const chat = data.data;

            // Update conversations list if new
            const { conversations } = get();
            if (!conversations.find((c: Conversation) => c._id === chat._id)) {
                set({ conversations: [chat, ...conversations] });
            }

            get().setActiveChat(chat);
        } catch (error) {
            console.error("Failed to start DM", error);
        }
    },

    addMessage: (message: Message) => {
        const { activeChat, messages, conversations } = get();

        // Update messages if active chat matches
        if (activeChat && activeChat._id === message.conversation) {
            // Avoid duplicates
            if (!messages.find((m: Message) => m._id === message._id)) {
                set({ messages: [...messages, message] });
            }
        }

        // Update last message in conversation list & reorder
        const updatedConversations = conversations.map((c: Conversation) => {
            if (c._id === message.conversation) {
                return { ...c, lastMessage: message, updatedAt: new Date().toISOString() };
            }
            return c;
        }).sort((a: Conversation, b: Conversation) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        set({ conversations: updatedConversations });
    },

    fetchDepartments: async () => {
        set({ isLoadingDepartments: true });
        try {
            const { data } = await axiosInstance.get("/departments");
            set({ departments: data.data, isLoadingDepartments: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch departments", isLoadingDepartments: false });
        }
    },

    fetchAvailableEmployees: async (departmentId: string) => {
        set({ isLoadingEmployees: true, availableEmployees: [] });
        try {
            const { data } = await axiosInstance.get(`/employees?department=${departmentId}`);
            // Map employee profile to user structure expected by UI if needed
            // The API returns employee profile with populated 'user' field.
            // We need to extract user info or adjust type.
            // Let's assume we map it to User type
            const users = data.data.map((emp: any) => ({
                _id: emp.userId,
                name: emp.name,
                email: emp.email,
                avatar: emp.avatar,
                role: emp.role,
                fatherName: emp.fatherName
            }));
            set({ availableEmployees: users, isLoadingEmployees: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch employees", isLoadingEmployees: false });
        }
    },

    clearAvailableEmployees: () => {
        set({ availableEmployees: [] });
    }
}));
