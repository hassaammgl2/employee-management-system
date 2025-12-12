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

    fetchChats: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    setActiveChat: (chat: Conversation) => void;
    sendMessage: (content: string) => Promise<void>;
    startDM: (userId: string) => Promise<void>;

    // Real-time actions
    addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeChat: null,
    messages: [],
    isLoadingChats: false,
    isLoadingMessages: false,
    error: null,

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
    }
}));
