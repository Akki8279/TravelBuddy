import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import API from "../api/axios";

// Derive socket url from API endpoint cleanly mapping
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
let socket = null;

const ChatModal = ({ isOpen, onClose, targetUser, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Smooth scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isOpen || !targetUser || !currentUserId) return;

    // 1. Fetch persistent history securely initially
    const fetchHistory = async () => {
      try {
        const res = await API.get(`/messages/${targetUser._id}`);
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchHistory();

    // 2. Safely connect socket singleton
    if (!socket) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
      });
      // Register Identity
      socket.emit("register_user", currentUserId);
    }

    // 3. Attach exact receive listener
    const handleReceiveMessage = (incomingMsg) => {
      // Safely ensure we only show messages related to this explicit modal pair
      const isRelevant = 
        (incomingMsg.sender === targetUser._id && incomingMsg.receiver === currentUserId) ||
        (incomingMsg.sender === currentUserId && incomingMsg.receiver === targetUser._id);

      if (isRelevant) {
        setMessages((prev) => [...prev, incomingMsg]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [isOpen, targetUser, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const msgPayload = {
      senderId: currentUserId,
      receiverId: targetUser._id,
      text: newMessage.trim(),
    };

    // Emit live!
    socket.emit("send_message", msgPayload);
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col h-[500px] overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
          <div className="font-semibold text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              👤
            </div>
            {targetUser.name}
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            ✖️
          </button>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">No messages yet. Say hi!</p>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender === currentUserId;
              return (
                <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      isMine 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-slate-200 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ➤
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatModal;
