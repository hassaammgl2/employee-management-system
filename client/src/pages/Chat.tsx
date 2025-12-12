import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chat";
import { useAuthStore } from "@/store/auth";
import { useSocket } from "@/context/SocketContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Users, UserPlus } from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


export default function Chat() {
    const { user } = useAuthStore();
    const { socket } = useSocket();
    const {
        conversations,
        activeChat,
        messages,
        fetchChats,
        setActiveChat,
        sendMessage,
        addMessage,
        startDM,
    } = useChatStore();

    const [newMessage, setNewMessage] = useState("");
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");

    const {
        departments,
        availableEmployees,
        fetchDepartments,
        fetchAvailableEmployees,
        isLoadingEmployees,
        clearAvailableEmployees
    } = useChatStore();

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    // Socket listeners
    useEffect(() => {
        if (socket) {
            socket.on("message:new", (message) => {
                addMessage(message);
            });

            return () => {
                socket.off("message:new");
            };
        }
    }, [socket, addMessage]);

    useEffect(() => {
        if (isNewChatOpen) {
            fetchDepartments();
        } else {
            // Reset selection when closed
            setSelectedDepartment("");
            setSelectedEmployee("");
            clearAvailableEmployees();
        }
    }, [isNewChatOpen, fetchDepartments, clearAvailableEmployees]);

    useEffect(() => {
        if (selectedDepartment) {
            fetchAvailableEmployees(selectedDepartment);
        } else {
            clearAvailableEmployees();
        }
    }, [selectedDepartment, fetchAvailableEmployees, clearAvailableEmployees]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await sendMessage(newMessage);
        setNewMessage("");
    };

    const handleStartDM = async () => {
        if (!selectedEmployee) return;

        try {
            await startDM(selectedEmployee);
            setIsNewChatOpen(false);
            setSelectedDepartment("");
            setSelectedEmployee("");
        } catch (error) {
            console.error("Failed to start chat", error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4 animate-fade-in">
            {/* Sidebar: Conversations List */}
            <Card className="w-80 flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Messages</h2>
                    <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <UserPlus className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        value={selectedDepartment}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDepartment && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Employee</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            onChange={(e) => setSelectedEmployee(e.target.value)}
                                            value={selectedEmployee}
                                            disabled={isLoadingEmployees}
                                        >
                                            <option value="">Select Employee</option>
                                            {availableEmployees.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name} ({emp.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <Button
                                    onClick={handleStartDM}
                                    className="w-full"
                                    disabled={!selectedEmployee || isLoadingEmployees}
                                >
                                    Start Chat
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                        {conversations.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => setActiveChat(chat)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${activeChat?._id === chat._id
                                    ? "bg-accent"
                                    : "hover:bg-accent/50"
                                    }`}
                            >
                                {chat.isGroup ? (
                                    <Avatar>
                                        <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <Avatar>
                                        <AvatarImage src={chat.members.find((m) => m._id !== user?._id)?.avatar} />
                                        <AvatarFallback>{chat.members.find((m) => m._id !== user?._id)?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium truncate">
                                            {chat.isGroup
                                                ? chat.department?.name || "Group"
                                                : chat.members.find((m) => m._id !== user?._id)?.name}
                                        </span>
                                        {chat.lastMessage && (
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {format(new Date(chat.updatedAt), "HH:mm")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {chat.lastMessage?.content || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                            {activeChat.isGroup ? (
                                <Avatar>
                                    <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            ) : (
                                <Avatar>
                                    <AvatarImage src={activeChat.members.find(m => m._id !== user?._id)?.avatar} />
                                    <AvatarFallback>{activeChat.members.find(m => m._id !== user?._id)?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div>
                                <h3 className="font-semibold">
                                    {activeChat.isGroup
                                        ? activeChat.department?.name || "Group"
                                        : activeChat.members.find(m => m._id !== user?._id)?.name}
                                </h3>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4 flex flex-col">
                                {messages.map((message) => {
                                    const isMe = (message.sender as any)._id === user?._id || message.sender === user?._id;
                                    return (
                                        <div
                                            key={message._id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted rounded-tl-none"
                                                    }`}
                                            >
                                                {!isMe && activeChat.isGroup && (
                                                    <p className="text-xs opacity-70 mb-1 font-semibold">
                                                        {(message.sender as any).name}
                                                    </p>
                                                )}
                                                <p className="text-sm">{message.content}</p>
                                                <span className="text-[10px] opacity-70 block text-right mt-1">
                                                    {format(new Date(message.createdAt), "HH:mm")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>

                        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <div className="bg-accent/50 p-6 rounded-full mb-4">
                            <Users className="h-12 w-12" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                        <p>Choose a chat from the sidebar or start a new one.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
