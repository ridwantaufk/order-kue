import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  Send,
  Paperclip,
  X,
  Check,
  CheckCheck,
  Minimize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import io from 'socket.io-client';

const ChatBuyer = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [showSessionList, setShowSessionList] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const customerPhone = localStorage.getItem('customer_phone');
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const updateTotalUnreadCount = useCallback((sessionsData) => {
    const total = sessionsData.reduce(
      (sum, session) => sum + (session.unread_count || 0),
      0,
    );
    setTotalUnreadCount(total);
  }, []);

  const handleTyping = useCallback(
    (typing) => {
      if (socket && activeSession) {
        socket.emit('typing', {
          session_id: activeSession.session_id,
          order_code: activeSession.order_code,
          typing,
        });

        if (typing) {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            if (socket && activeSession) {
              socket.emit('typing', {
                session_id: activeSession.session_id,
                order_code: activeSession.order_code,
                typing: false,
              });
            }
            typingTimeoutRef.current = null;
          }, 1000);
        } else {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      }
    },
    [socket, activeSession],
  );

  useEffect(() => {
    if (!customerPhone) return;

    const socketConnection = io(backendUrl, {
      extraHeaders: { 'ngrok-skip-browser-warning': 'true' },
    });
    setSocket(socketConnection);

    socketConnection.emit('buyer_join', { customerPhone });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketConnection.disconnect();
    };
  }, [customerPhone, backendUrl]);

  useEffect(() => {
    if (!socket) return;

    const handleChatSessions = (data) => {
      setSessions(data);
      updateTotalUnreadCount(data);
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0]);
      }
    };

    const handleNewChatSession = (session) => {
      setSessions((prev) => {
        if (prev.find((s) => s.session_id === session.session_id)) {
          return prev;
        }
        const newSessions = [session, ...prev];
        updateTotalUnreadCount(newSessions);
        // Automatically select the new session if it's the first one
        if (prev.length === 0) {
          setActiveSession(session);
        }
        return newSessions;
      });
    };

    const handleNewMessage = (message) => {
      if (message.session_id === activeSession?.session_id) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) => msg.message_id === message.message_id,
          );
          return exists ? prev : [...prev, message];
        });
      }
      setSessions((prev) => {
        const updated = prev.map((session) => {
          if (session.session_id === message.session_id) {
            return {
              ...session,
              last_message: message,
              unread_count:
                message.sender_type === 'admin' &&
                (!isOpen || activeSession?.session_id !== message.session_id)
                  ? (session.unread_count || 0) + 1
                  : session.unread_count,
              updated_at: message.created_at,
            };
          }
          return session;
        });
        updateTotalUnreadCount(updated);
        return updated.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        );
      });
    };

    const handleAdminTyping = ({ session_id, typing }) => {
      if (session_id === activeSession?.session_id) {
        setAdminTyping(typing);
        if (typing) {
          setTimeout(() => setAdminTyping(false), 2000);
        }
      }
    };

    const handleAdminOnline = (online) => {
      setAdminOnline(online);
    };

    const handleMessagesMarkedRead = ({ session_id }) => {
      if (activeSession?.session_id === session_id) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            read_at: msg.sender_type === 'buyer' ? new Date() : msg.read_at,
          })),
        );
      }
      setSessions((prev) => {
        const updated = prev.map((session) =>
          session.session_id === session_id
            ? { ...session, unread_count: 0 }
            : session,
        );
        updateTotalUnreadCount(updated);
        return updated;
      });
    };

    socket.on('chat_sessions', handleChatSessions);
    socket.on('new_chat_session', handleNewChatSession);
    socket.on('new_message', handleNewMessage);
    socket.on('admin_typing', handleAdminTyping);
    socket.on('admin_online_status', ({ online }) => setAdminOnline(online));
    socket.on('admin_online', handleAdminOnline);
    socket.on('messages_marked_read', handleMessagesMarkedRead);

    return () => {
      socket.off('chat_sessions', handleChatSessions);
      socket.off('new_chat_session', handleNewChatSession);
      socket.off('new_message', handleNewMessage);
      socket.off('admin_typing', handleAdminTyping);
      socket.off('admin_online_status');
      socket.off('admin_online', handleAdminOnline);
      socket.off('messages_marked_read', handleMessagesMarkedRead);
    };
  }, [socket, activeSession, isOpen, updateTotalUnreadCount]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (activeSession && socket && isOpen) {
      socket.emit('mark_messages_read', {
        session_id: activeSession.session_id,
        order_code: activeSession.order_code,
      });
      setSessions((prev) => {
        const updated = prev.map((session) =>
          session.session_id === activeSession.session_id
            ? { ...session, unread_count: 0 }
            : session,
        );
        updateTotalUnreadCount(updated);
        return updated;
      });
    }
  }, [activeSession, socket, isOpen, updateTotalUnreadCount]);

  const selectSession = async (session) => {
    if (session.session_id === activeSession?.session_id) return;

    setLoading(true);
    setActiveSession(session);
    setAdminTyping(false);

    try {
      const response = await fetch(
        `${backendUrl}/api/chat/sessions/${session.order_code}`,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        const sessionData = await response.json();
        setMessages(sessionData.ChatMessages || []);
      }
    } catch (error) {
      console.error('Failed to fetch session messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const resizeImage = (file) =>
    new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800,
          maxHeight = 600;
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      img.src = URL.createObjectURL(file);
    });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession) return;

    const messageData = {
      session_id: activeSession.session_id,
      sender_type: 'buyer',
      sender_id: 241, // Should be dynamic based on order
      message: newMessage,
    };

    try {
      const response = await fetch(`${backendUrl}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages((prev) => [...prev, newMsg]);
        setNewMessage('');
        handleTyping(false);
        socket?.emit('send_message', newMsg);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !activeSession || !file.type.startsWith('image/')) {
      if (file && !file.type.startsWith('image/'))
        alert('Hanya file gambar yang diizinkan.');
      return;
    }

    const processedFile =
      file.size > 1024 * 1024 ? await resizeImage(file) : file;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const messageData = {
        session_id: activeSession.session_id,
        sender_type: 'buyer',
        sender_id: 241,
        message: '',
        file_url: e.target.result,
        file_type: processedFile.type,
      };
      try {
        const response = await fetch(`${backendUrl}/api/chat/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });
        if (response.ok) {
          const newMsg = await response.json();
          setMessages((prev) => [...prev, newMsg]);
          socket?.emit('send_message', newMsg);
        }
      } catch (error) {
        console.error('Failed to send file:', error);
      }
    };
    reader.readAsDataURL(processedFile);
  };

  const getMessageStatus = (message) => {
    if (message.sender_type === 'admin') return null;
    if (message.read_at)
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    return adminOnline ? (
      <CheckCheck className="w-3 h-3 text-gray-400" />
    ) : (
      <Check className="w-3 h-3 text-gray-400" />
    );
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (!customerPhone) return null;

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
          isOpen ? 'w-80 h-96' : 'w-14 h-14'
        }`}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center relative"
          >
            <MessageCircle className="w-6 h-6" />
            {totalUnreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </div>
            )}
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col">
            <div className="p-3 bg-blue-500 text-white rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {sessions.length > 1 && (
                  <button
                    onClick={() => setShowSessionList(!showSessionList)}
                    className="text-white hover:text-gray-200 mr-1"
                  >
                    {showSessionList ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {activeSession
                        ? activeSession.order_code?.slice(-2) || 'CS'
                        : 'CS'}
                    </span>
                  </div>
                  {adminOnline && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {activeSession
                      ? `Order ${activeSession.order_code}`
                      : 'Customer Service'}
                  </p>
                  <p className="text-xs opacity-75">
                    {adminOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {sessions.length > 1 && showSessionList && (
              <div className="border-b border-gray-200 bg-gray-50 max-h-24 overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => {
                      selectSession(session);
                      setShowSessionList(false);
                    }}
                    className={`p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-100 text-sm ${
                      activeSession?.session_id === session.session_id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{session.order_code}</span>
                      {session.unread_count > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {session.unread_count > 9
                            ? '9+'
                            : session.unread_count}
                        </div>
                      )}
                    </div>
                    {session.last_message && (
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {session.last_message.message || 'File attachment'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : !activeSession ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Memuat chat...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Belum ada pesan</p>
                  <p className="text-xs">
                    Mulai percakapan dengan customer service
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.message_id}
                    className={`flex ${
                      message.sender_type === 'buyer'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender_type === 'buyer'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {message.file_url ? (
                        <img
                          src={message.file_url}
                          alt="attachment"
                          className="max-w-full rounded cursor-pointer"
                          onClick={() => setSelectedImage(message.file_url)}
                        />
                      ) : (
                        <p>{message.message}</p>
                      )}
                      <div
                        className={`flex items-center justify-between mt-1 ${
                          message.sender_type === 'buyer'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="text-xs">
                          {formatTime(message.created_at)}
                        </span>
                        {getMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {adminTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-200 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      Customer service sedang mengetik...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  disabled={!activeSession}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping(true);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  onBlur={() => handleTyping(false)}
                  placeholder={
                    activeSession
                      ? 'Ketik pesan...'
                      : 'Pilih chat terlebih dahulu...'
                  }
                  disabled={!activeSession}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !activeSession}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-white text-gray-600 hover:text-gray-800 rounded-full p-1 shadow-lg z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBuyer;
