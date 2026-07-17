import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, User, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: number;
  receiver_id: number | string;
  content: string;
  created_at: string;
}

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stateData = location.state as { startChatWith?: string | number; username?: string } | null;
  const targetUserId = stateData?.startChatWith ? String(stateData.startChatWith) : null;
  const targetUserName = stateData?.username || null;

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem('sfm_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior });
  };

  const isUserAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    const threshold = 100; 
    return (container.scrollHeight - container.scrollTop - container.clientHeight) < threshold;
  };

  // Function ya kuambia Backend kuwa meseji zimeshasomwa (Kama WhatsApp)
  const markMessagesAsRead = async (partnerId: string) => {
    try {
      // Tunatuma request kwenda backend kusafisha unread za huyu partner
      await axios.post(`http://localhost:8000/api/messages/mark_read/`, {
        partner_id: parseInt(partnerId)
      }, {
        headers: getAuthHeader()
      });

      // Baada ya kuambia backend, tunasafisha pia huku kwenye frontend (UI) papo hapo
      setConversations((prev) =>
        prev.map((c) =>
          String(c.id) === String(partnerId) ? { ...c, unread: 0 } : c
        )
      );
    } catch (error) {
      console.error("Imeshindwa ku-mark kama zimesomwa:", error);
    }
  };

  // 1. Unapobadili chat, shusha chini na weka alama ya "Read" (Soma)
  useEffect(() => {
    if (activeChat) {
      setTimeout(() => {
        scrollToBottom('auto');
      }, 50);
      markMessagesAsRead(activeChat); // <--- Inasafisha namba ukiingia kwenye chat
    }
  }, [activeChat]);

  // 2. Kupata conversations za pembeni
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/messages/conversations/', {
          headers: getAuthHeader()
        });
        
        let fetchedConversations = response.data;

        if (targetUserId && targetUserName) {
          const exists = fetchedConversations.some((c: Conversation) => String(c.id) === String(targetUserId));
          if (!exists) {
            const tempChat: Conversation = {
              id: String(targetUserId),
              name: targetUserName,
              role: 'Client',
              lastMessage: 'Anza kuandika ujumbe...',
              time: 'Sasa hivi',
              unread: 0
            };
            fetchedConversations = [tempChat, ...fetchedConversations];
          }
          setActiveChat(String(targetUserId));
        }
        
        setConversations(fetchedConversations);
      } catch (error) {
        console.error("Shida ya kupata mazungumzo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [targetUserId, targetUserName]);

  // 3. Polling ya kila sekunde 4
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/messages/?partner_id=${activeChat}`, {
          headers: getAuthHeader()
        });
        
        const wasAtBottom = isUserAtBottom();

        setMessages((prevMessages) => {
          if (JSON.stringify(prevMessages) === JSON.stringify(response.data)) {
            return prevMessages;
          }
          
          if (wasAtBottom) {
            setTimeout(() => scrollToBottom('smooth'), 50);
          }
          
          // Kama kuna ujumbe mpya umeingia tukiwa bado ndani ya chat hii hii, weka kama umeshasomwa
          markMessagesAsRead(activeChat); 

          return response.data;
        });

      } catch (error) {
        console.error("Meseji zimeshindwa kupatikana:", error);
      }
    };

    fetchMessages();
    
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChat]);

  // 4. Kutuma meseji mpya
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const response = await axios.post('http://localhost:8000/api/messages/', {
        receiver_id: parseInt(activeChat),
        content: newMessage
      }, {
        headers: getAuthHeader()
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');

      setTimeout(() => scrollToBottom('smooth'), 50);

      setConversations((prev) =>
        prev.map((c) =>
          String(c.id) === String(activeChat)
            ? { ...c, lastMessage: newMessage, time: 'Sasa hivi', unread: 0 }
            : c
        )
      );
    } catch (error) {
      console.error("Meseji haijatumwa:", error);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-200px)] min-h-[500px] flex">
        
        {/* SIDEBAR */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h1 className="text-xl font-bold text-slate-900 mb-3">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No active conversations
              </div>
            ) : (
              filteredConversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(String(chat.id))}
                  className={`w-full p-4 flex items-start gap-3 transition-colors text-left ${
                    activeChat === String(chat.id) ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-slate-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-1">{chat.role}</p>
                    <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                      {chat.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/30">
          {activeChat ? (
            <>
              {(() => {
                const partner = conversations.find((c) => String(c.id) === String(activeChat));
                return (
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-slate-900">{partner?.name}</h2>
                        <span className="text-xs text-emerald-600 font-medium capitalize">{partner?.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* MESSAGE AREA */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((msg) => {
                  const currentUserId = String(currentUser?.id || '');
                  const isMe = String(msg.receiver_id) !== currentUserId;

                  return (
                    <div key={msg.id} className="w-full flex">
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none ml-auto'  
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none mr-auto' 
                      }`}>
                        <p className="break-words leading-relaxed">{msg.content}</p>
                        <span className={`block text-[10px] mt-1 text-right select-none ${
                          isMe ? 'text-blue-200' : 'text-slate-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* INPUT FORM */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-md active:scale-95"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Direct Messages</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Select a conversation from the left to start chatting, or start a conversation by messaging someone from a job page.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}