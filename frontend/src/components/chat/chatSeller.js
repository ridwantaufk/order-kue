import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  Paperclip,
  X,
  Check,
  CheckCheck,
  Minimize2,
  Users,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import io from 'socket.io-client';

const ChatAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [showSessionList, setShowSessionList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // Update user status
  const updateUserStatus = async () => {
    if (!token || !userId) return;

    try {
      await fetch(`${backendUrl}/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_active: new Date() }),
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  // Keep user active
  useEffect(() => {
    updateUserStatus();
    const interval = setInterval(updateUserStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Socket connection and event handlers
  useEffect(() => {
    if (!token || !userId) return;

    console.log('Admin connecting to socket...');
    const socketConnection = io(backendUrl);
    setSocket(socketConnection);

    // Join as admin
    socketConnection.emit('admin_join', { userId, token });

    // Listen for chat sessions
    socketConnection.on('chat_sessions', (data) => {
      console.log('Chat sessions received:', data);
      setSessions(data);
      updateTotalUnreadCount(data);
    });

    // Listen for messages when session is active
    socketConnection.on('chat_messages', (data) => {
      console.log('Chat messages received:', data);
      if (data.session_id === activeSession?.session_id) {
        setMessages(data.messages || data);
      }
    });

    // Listen for new messages
    socketConnection.on('new_message', (message) => {
      console.log('New message received:', message);

      // Add to messages if it's for the active session
      if (message.session_id === activeSession?.session_id) {
        setMessages((prev) => {
          // Cek apakah pesan sudah ada berdasarkan message_id
          const messageExists = prev.some(
            (msg) => msg.message_id === message.message_id,
          );

          if (messageExists) {
            console.log(
              'Message already exists, skipping:',
              message.message_id,
            );
            return prev; // Jangan tambahkan jika sudah ada
          }

          return [...prev, message];
        });
      }

      // Update sessions list
      setSessions((prev) => {
        const updatedSessions = prev.map((session) =>
          session.session_id === message.session_id
            ? {
                ...session,
                last_message: message,
                unread_count:
                  message.sender_type === 'buyer'
                    ? (session.unread_count || 0) + 1
                    : session.unread_count,
                updated_at: message.created_at,
              }
            : session,
        );
        updateTotalUnreadCount(updatedSessions);
        return updatedSessions;
      });
    });

    // Listen for typing indicators
    socketConnection.on('user_typing', ({ session_id, user_id, typing }) => {
      console.log('User typing:', { session_id, user_id, typing });
      if (session_id === activeSession?.session_id) {
        setTypingUsers((prev) => ({
          ...prev,
          [user_id]: typing,
        }));
      }
    });

    // Listen for buyer online status
    socketConnection.on('buyer_online', ({ orderCode, online }) => {
      console.log('Buyer online status:', { orderCode, online });
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (online) {
          updated.add(orderCode);
        } else {
          updated.delete(orderCode);
        }
        return updated;
      });

      // Update session online status
      setSessions((prev) =>
        prev.map((session) =>
          session.order_code === orderCode
            ? { ...session, buyer_online: online }
            : session,
        ),
      );
    });

    // Listen for messages marked as read
    socketConnection.on('messages_marked_read', ({ session_id }) => {
      if (activeSession && activeSession.session_id === session_id) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            read_at: msg.sender_type === 'admin' ? new Date() : msg.read_at,
          })),
        );
      }
    });

    // Cleanup
    return () => {
      console.log('Disconnecting admin socket');
      socketConnection.disconnect();
    };
  }, [token, userId, backendUrl, activeSession]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when session becomes active
  useEffect(() => {
    if (activeSession && socket) {
      markMessagesAsRead();
    }
  }, [activeSession, socket]);

  // Update total unread count
  const updateTotalUnreadCount = (sessionsData) => {
    const total = sessionsData.reduce(
      (sum, session) => sum + (session.unread_count || 0),
      0,
    );
    setTotalUnreadCount(total);
  };

  // Mark messages as read
  const markMessagesAsRead = () => {
    if (socket && activeSession) {
      console.log(
        'Marking messages as read for session:',
        activeSession.session_id,
      );
      socket.emit('mark_messages_read', {
        session_id: activeSession.session_id,
        user_id: userId,
      });

      // Update local session unread count
      setSessions((prev) =>
        prev.map((session) =>
          session.session_id === activeSession.session_id
            ? { ...session, unread_count: 0 }
            : session,
        ),
      );
    }
  };

  // Select session
  const selectSession = async (session) => {
    setLoading(true);
    setActiveSession(session);

    try {
      // Fetch messages for this session
      const response = await fetch(
        `${backendUrl}/api/chat/sessions/${session.order_code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession) return;

    const messageData = {
      session_id: activeSession.session_id,
      sender_type: 'admin',
      sender_id: parseInt(userId),
      message: newMessage,
    };

    console.log('Sending admin message:', messageData);

    try {
      const response = await fetch(`${backendUrl}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMsg = await response.json();
        console.log('Admin message sent successfully:', newMsg);

        // Add message to local state
        setMessages((prev) => [...prev, newMsg]);
        setNewMessage('');

        // Emit via socket to broadcast to buyer
        if (socket) {
          socket.emit('send_message', newMsg);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to send admin message:', errorText);
      }
    } catch (error) {
      console.error('Failed to send admin message:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !activeSession) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan.');
      return;
    }

    let processedFile = file;
    if (file.size > 1024 * 1024) {
      processedFile = await resizeImage(file);
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const messageData = {
        session_id: activeSession.session_id,
        sender_type: 'admin',
        sender_id: parseInt(userId),
        message: '',
        file_url: e.target.result,
        file_type: processedFile.type,
      };

      try {
        const response = await fetch(`${backendUrl}/api/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          const newMsg = await response.json();
          setMessages((prev) => [...prev, newMsg]);

          if (socket) {
            socket.emit('send_message', newMsg);
          }
        }
      } catch (error) {
        console.error('Failed to send file:', error);
      }
    };
    reader.readAsDataURL(processedFile);
  };

  // Resize image
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle typing
  const handleTyping = (typing) => {
    if (socket && activeSession) {
      socket.emit('typing', {
        session_id: activeSession.session_id,
        user_id: userId,
        typing,
      });

      if (typing) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          socket.emit('typing', {
            session_id: activeSession.session_id,
            user_id: userId,
            typing: false,
          });
        }, 3000);
      }
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get message status
  const getMessageStatus = (message) => {
    if (message.sender_type === 'buyer') return null;

    if (message.read_at) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }

    const buyerOnline =
      activeSession && onlineUsers.has(activeSession.order_code);
    return buyerOnline ? (
      <CheckCheck className="w-3 h-3 text-gray-400" />
    ) : (
      <Check className="w-3 h-3 text-gray-400" />
    );
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.order_code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && session.unread_count > 0) ||
      (filterStatus === 'online' && session.buyer_online);

    return matchesSearch && matchesFilter;
  });

  if (!token || !userId) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
          isOpen ? 'w-96 h-[600px]' : 'w-14 h-14'
        }`}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center relative"
          >
            <Users className="w-6 h-6" />
            {totalUnreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </div>
            )}
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex">
            {/* Sessions List */}
            <div
              className={`${
                showSessionList ? 'w-48' : 'w-0'
              } transition-all duration-300 overflow-hidden border-r border-gray-200 flex flex-col`}
            >
              <div className="p-3 bg-green-500 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Chat Sessions</h3>
                  <button
                    onClick={() => setShowSessionList(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari order..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-xs text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-300"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-2 py-1 text-xs text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-300"
                  >
                    <option value="all">Semua</option>
                    <option value="unread">Belum dibaca</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredSessions.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Tidak ada sesi chat</p>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => selectSession(session)}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        activeSession?.session_id === session.session_id
                          ? 'bg-green-50 border-l-4 border-l-green-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold">
                                {session.order_code?.slice(-2) || 'N/A'}
                              </span>
                            </div>
                            {session.buyer_online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {session.order_code || 'Unknown Order'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {session.buyer_online ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                        {session.unread_count > 0 && (
                          <div className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {session.unread_count > 9
                              ? '9+'
                              : session.unread_count}
                          </div>
                        )}
                      </div>

                      {session.last_message && (
                        <div>
                          <p className="text-xs text-gray-600 truncate">
                            {session.last_message.message || 'File attachment'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(session.last_message.created_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeSession ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 bg-green-500 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {!showSessionList && (
                        <button
                          onClick={() => setShowSessionList(true)}
                          className="text-white hover:text-gray-200 mr-2"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      )}
                      <div className="relative">
                        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold">
                            {activeSession.order_code?.slice(-2) || 'N/A'}
                          </span>
                        </div>
                        {activeSession.buyer_online && (
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {activeSession.order_code}
                        </p>
                        <p className="text-xs opacity-75">
                          {activeSession.buyer_online ? 'Online' : 'Offline'}
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

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Belum ada pesan</p>
                        <p className="text-xs">
                          Mulai percakapan dengan customer
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.message_id}
                          className={`flex ${
                            message.sender_type === 'admin'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.sender_type === 'admin'
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            {message.file_url ? (
                              <img
                                src={message.file_url}
                                alt="attachment"
                                className="max-w-full rounded cursor-pointer"
                                onClick={() =>
                                  setSelectedImage(message.file_url)
                                }
                              />
                            ) : (
                              <p>{message.message}</p>
                            )}

                            <div
                              className={`flex items-center justify-between mt-1 ${
                                message.sender_type === 'admin'
                                  ? 'text-green-100'
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

                    {/* Typing indicators */}
                    {Object.entries(typingUsers).some(
                      ([, typing]) => typing,
                    ) && (
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
                            Customer sedang mengetik...
                          </span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
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
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          if (!isTyping) {
                            setIsTyping(true);
                            handleTyping(true);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                        onBlur={() => {
                          setIsTyping(false);
                          handleTyping(false);
                        }}
                        placeholder="Ketik pesan..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* No Session Selected */
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    {!showSessionList && (
                      <button
                        onClick={() => setShowSessionList(true)}
                        className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                      <Minimize2 className="w-5 h-5" />
                    </button>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Admin Chat</p>
                    <p className="text-sm">
                      Pilih sesi chat untuk memulai percakapan
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
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

export default ChatAdmin;
