import { useEffect, useState, useRef, useContext } from "react";
import io from "socket.io-client";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
let socket = null;

const ChatInbox = () => {
  const { user } = useContext(AuthContext);
  
  // Left Pane State
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null); // The user we clicked on
  
  // Right Pane Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Smooth scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ 1. Load Conversations from MongoDB
  const fetchConversations = async () => {
    try {
      const res = await API.get("/messages/conversations");
      setConversations(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // ✅ 2. Handle Socket Global Connect & Active Chat Fetch
  useEffect(() => {
    if (!user) return;

    // Connect socket if not exists 
    if (!socket) {
      socket = io(SOCKET_URL, { withCredentials: true });
      socket.emit("register_user", user._id);
    }

    // Always listen for messages to update the SIDEBAR and the CHAT PANE
    const handleReceiveMessage = (incomingMsg) => {
      
      // Update Sidebar Layout to pop the latest message to the top or update preview text
      setConversations((prev) => {
        const convoExists = prev.find(
          (c) => 
            c.user._id === incomingMsg.sender || c.user._id === incomingMsg.receiver
        );

        if (convoExists) {
          return prev.map((c) => {
            if (c.user._id === incomingMsg.sender || c.user._id === incomingMsg.receiver) {
              return { ...c, lastMessage: incomingMsg.text, lastMessageTime: incomingMsg.createdAt };
            }
            return c;
          });
        }

        // Technically if it's a completely new unlisted user, we'd refetch or inject here. 
        // For safety, re-firing fetchConversations syncs the name/avatar precisely.
        fetchConversations();
        return prev;
      });

      // Update Chat Pane if it's relevant to our actively opened window
      if (activeUser) {
        const isRelevant = 
          (incomingMsg.sender === activeUser._id && incomingMsg.receiver === user._id) ||
          (incomingMsg.sender === user._id && incomingMsg.receiver === activeUser._id);

        if (isRelevant) {
          setMessages((prev) => [...prev, incomingMsg]);
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user, activeUser]);


  // ✅ 3. Load Chat History whenever a user clicks a Sidebar item
  useEffect(() => {
    if (!activeUser) return;

    const fetchHistory = async () => {
      try {
        const res = await API.get(`/messages/${activeUser._id}`);
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    fetchHistory();
  }, [activeUser]);

  // Handle autoscroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // ✅ 4. Send a new message actively
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activeUser) return;

    const msgPayload = {
      senderId: user._id,
      receiverId: activeUser._id,
      text: newMessage.trim(),
    };

    socket.emit("send_message", msgPayload);
    setNewMessage("");
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full flex-1 flex my-6 px-4 gap-6 min-h-0">
        
        {/* Left Pane: Conversations Sidebar */}
        <div className="w-1/3 bg-white shadow-lg rounded-2xl flex flex-col border border-slate-200 overflow-hidden shrink-0 hidden md:flex">
          <div className="p-4 bg-blue-600 text-white font-semibold text-lg">
            Messages Inbox
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-2 bg-slate-50">
            {conversations.length === 0 ? (
              <p className="text-sm text-slate-500 text-center mt-10 p-4">
                No active conversations yet.
              </p>
            ) : (
              conversations.map((convo) => {
                const isActive = activeUser?._id === convo.user._id;
                
                return (
                  <button
                    key={convo.user._id}
                    onClick={() => setActiveUser(convo.user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                      isActive ? "bg-blue-100 border-blue-300 shadow-sm" : "hover:bg-slate-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 text-white shadow-sm bg-blue-500">
                      {convo.user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="text-left w-full overflow-hidden">
                      <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                        {convo.user.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {convo.lastMessage || "Click to chat"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Layout */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl flex flex-col border border-slate-200 overflow-hidden">
          {!activeUser ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
               <span className="text-5xl mb-4">💬</span>
               <p className="text-lg">Select a conversation to start chatting.</p>
             </div>
          ) : (
             <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b flex items-center gap-3 shadow-sm z-10">
                  <div className="w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0 bg-blue-500 text-white">
                    {activeUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 tracking-tight">{activeUser.name}</h3>
                    <p className="text-xs text-green-500 font-medium tracking-wide">Connected</p>
                  </div>
                </div>

                {/* Message Feed Canvas */}
                <div className="flex-1 overflow-y-auto w-full p-4 bg-slate-50 relative space-y-4">
                  {messages.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 p-8 text-center text-sm">
                      This is the beginning of your chat history. Say hi!
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMine = msg.sender === user._id;
                      return (
                        <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] sm:max-w-[60%] px-4 py-2 text-[15px] shadow-sm ${
                              isMine 
                                ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" 
                                : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none"
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

                {/* Secure Input Area */}
                <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <input
                    type="text"
                    className="flex-1 bg-slate-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border hover:border-blue-300 transition-all text-slate-700"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 disabled:cursor-not-allowed transition shadow-md"
                  >
                     ▶
                  </button>
                </form>
             </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatInbox;
