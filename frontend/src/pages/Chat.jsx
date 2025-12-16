import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import API_URL from '../config';

const Chat = () => {
    const { userId } = useParams(); // The user we are chatting with
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load initial data
    useEffect(() => {
        if (!user) return;

        fetchConversations();

        if (userId) {
            fetchChatUser(userId);
            fetchMessages(userId);

            // Polling for new messages every 3 seconds
            const interval = setInterval(() => {
                fetchMessages(userId, true);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [userId, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/conversations`);
            setConversations(res.data);
        } catch (error) {
            console.error("Error fetching conversations", error);
        }
    };

    const fetchChatUser = async (id) => {
        // Optimistically set from conversations if available, or assume name loading
        // For now, simpler to rely on messages or just fetch generic user info if needed
        // Assuming we might have basic user info from conversation list
    };

    const fetchMessages = async (id, background = false) => {
        try {
            const res = await axios.get(`${API_URL}/chat/${id}`);
            // Only update if length changed or strict update needed
            // For MVP, just update state. React handles dom diffing.
            setMessages(res.data);
        } catch (error) {
            if (!background) toast.error("Failed to load messages");
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const msg = newMessage;
            setNewMessage(''); // Optimistic clear

            // Optimistic UI update
            const tempMsg = {
                _id: Date.now(),
                senderId: user._id,
                message: msg,
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, tempMsg]);

            await axios.post(`${API_URL}/chat`, {
                receiverId: userId,
                message: msg
            });

            // Re-fetch to get real ID and status
            fetchMessages(userId, true);
            fetchConversations(); // Update last message in sidebar

        } catch (error) {
            toast.error("Failed to send");
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-gray-100 flex overflow-hidden">
            {/* Sidebar (Conversations) */}
            <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col ${userId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No conversations yet.</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.user._id}
                                onClick={() => navigate(`/chat/${conv.user._id}`)}
                                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${userId === conv.user._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                                    {getInitials(conv.user.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                                        <span className="text-xs text-gray-500">{new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#efeae2] ${!userId ? 'hidden md:flex' : 'flex'}`}>
                {userId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm z-10">
                            <button onClick={() => navigate('/chat')} className="md:hidden mr-4 text-gray-600">
                                ← Back
                            </button>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                {messages.length > 0 && messages[0].senderId === userId
                                    ? getInitials('User') // Placeholder as we don't have name readily available in specific msg always
                                    : 'SP'}
                                {/* Ideally we fetch user details or pass from previous screen. For now generic. */}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Chat</h3>
                                <p className="text-xs text-green-500 font-medium">● Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === user._id;
                                return (
                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] md:max-w-[60%] rounded-lg px-4 py-2 shadow-sm relative ${isMe ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm md:text-base">{msg.message}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && <span className="ml-1 text-blue-500">✓✓</span>}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-200">
                            <form onSubmit={sendMessage} className="flex items-center space-x-2">
                                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                                    <span className="text-xl">😊</span>
                                </button>
                                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                                    <span className="text-xl">📎</span>
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message"
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] shadow-md transition-transform active:scale-95"
                                >
                                    ➤
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            💬
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">Select a chat to start messaging</h3>
                        <p className="text-sm mt-2">Send photos and messages to friends and family.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
