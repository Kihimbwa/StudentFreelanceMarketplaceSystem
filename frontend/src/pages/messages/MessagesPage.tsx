import { useEffect, useState, useMemo, useRef } from "react";
import { Send, MessageSquare, Search } from "lucide-react";
import { Message } from "../../types";
import { messageService } from "../../services/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { timeAgo, formatDateTime, getErrorMessage } from "../../utils/helpers";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";

// Helper function iliyosogezwa juu ili iwe safi na rahisi kutumia
function getConversationPartners(messages: Message[], userId?: number): number[] {
  if (!userId) return [];
  const partnerSet = new Set<number>();
  messages.forEach((m) => {
    if (m.sender === userId) partnerSet.add(m.receiver);
    else if (m.receiver === userId) partnerSet.add(m.sender);
  });
  return Array.from(partnerSet);
}

export default function MessagesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await messageService.getAll();
      const validMessages = Array.isArray(data) ? data : [];
      setMessages(validMessages);
      
      const partners = getConversationPartners(validMessages, user?.id);
      if (partners.length > 0 && activeUser === null) {
        setActiveUser(partners[0]);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load messages"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeUser]); // Imeongezwa activeUser hapa ili scroll ifanye kazi ukibadili chat

  const conversationPartners = useMemo(
    () => getConversationPartners(messages, user?.id),
    [messages, user]
  );

  const filteredPartners = useMemo(() => {
    if (!search) return conversationPartners;
    return conversationPartners.filter((p) => 
      `User ${p}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [conversationPartners, search]);

  // Tunatengeneza Map ya ujumbe wa mwisho kwa kila partner mara moja tu, badala ya kufanya filter/sort ndani ya loop ya render
  const lastMessagesMap = useMemo(() => {
    const map: Record<number, Message> = {};
    if (!user?.id) return map;

    // Kwanza tunapanga ujumbe kwa kupitia mwanzo hadi mwisho ili ujumbe wa mwisho u-overwrite ule wa kwanza
    const sorted = [...messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sorted.forEach((m) => {
      const partnerId = m.sender === user.id ? m.receiver : m.sender;
      map[partnerId] = m;
    });

    return map;
  }, [messages, user]);

  const activeMessages = useMemo(() => {
    if (!activeUser || !user) return [];
    return messages
      .filter((m) =>
        (m.sender === user.id && m.receiver === activeUser) ||
        (m.sender === activeUser && m.receiver === user.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, activeUser, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser || !content.trim()) return;
    setSending(true);
    try {
      const newMsg = await messageService.create({
        receiver: activeUser,
        content: content.trim(),
      });
      setMessages((prev) => [...prev, newMsg]);
      setContent("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
        <p className="text-slate-500">Chat with clients and students directly.</p>
      </div>

      {conversationPartners.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          message="Start a conversation by messaging someone from a job page."
          icon={<MessageSquare className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[600px]">
          {/* Sidebar - Conversation List */}
          <div className="md:col-span-1 border-r border-slate-200 flex flex-col">
            <div className="p-3 border-b border-slate-100">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredPartners.map((partnerId) => {
                const lastMsg = lastMessagesMap[partnerId];
                return (
                  <button
                    key={partnerId}
                    onClick={() => setActiveUser(partnerId)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors ${
                      activeUser === partnerId ? "bg-sky-50" : ""
                    }`}
                  >
                    <Avatar name={`User ${partnerId}`} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">User #{partnerId}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {lastMsg?.content || "No messages"}
                      </p>
                    </div>
                    {lastMsg && (
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {timeAgo(lastMsg.timestamp)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {activeUser ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                  <Avatar name={`User ${activeUser}`} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900">User #{activeUser}</p>
                    <p className="text-xs text-slate-400">Active conversation</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {activeMessages.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-400">
                      No messages yet. Say hello!
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMine = msg.sender === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                              isMine
                                ? "bg-slate-900 text-white"
                                : "bg-white border border-slate-200 text-slate-700"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <p className="text-xs mt-1 text-slate-400 text-right">
                              {formatDateTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <Button type="submit" loading={sending} disabled={!content.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}