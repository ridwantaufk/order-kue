import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  Paperclip,
  X,
  Check,
  CheckCheck,
  Minimize2,
} from 'lucide-react';
import io from 'socket.io-client';

const ChatBuyer = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const orderCode = localStorage.getItem('order_code');
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!orderCode) return;

    console.log('Connecting to socket with order code:', orderCode);
    const socketConnection = io(backendUrl);
    setSocket(socketConnection);

    // Join as buyer
    socketConnection.emit('buyer_join', { orderCode });

    // Listen for chat session data
    socketConnection.on('chat_session', (sessionData) => {
      console.log('Chat session received:', sessionData);
      setSession(sessionData);
    });

    // Listen for initial messages
    socketConnection.on('chat_messages', (messagesData) => {
      console.log('Chat messages received:', messagesData);
      setMessages(messagesData);

      // Count unread admin messages
      if (!isOpen) {
        const unread = messagesData.filter(
          (msg) => msg.sender_type === 'admin' && !msg.read_at,
        ).length;
        setUnreadCount(unread);
      }
    });

    // Listen for new messages
    socketConnection.on('new_message', (message) => {
      console.log('New message received:', message);
      setMessages((prev) => [...prev, message]);

      // Update unread count if chat is closed and message is from admin
      if (!isOpen && message.sender_type === 'admin') {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Listen for admin typing
    socketConnection.on('admin_typing', ({ typing }) => {
      console.log('Admin typing:', typing);
      setAdminTyping(typing);
    });

    // Listen for admin online status
    socketConnection.on('admin_online_status', ({ online }) => {
      console.log('Admin online status:', online);
      setAdminOnline(online);
    });

    // Listen for messages marked as read
    socketConnection.on('messages_marked_read', ({ session_id }) => {
      if (session && session.session_id === session_id) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            read_at: msg.sender_type === 'buyer' ? new Date() : msg.read_at,
          })),
        );
      }
    });

    // Cleanup
    return () => {
      console.log('Disconnecting socket');
      socketConnection.disconnect();
    };
  }, [orderCode, backendUrl, isOpen]);

  useEffect(() => {
    if (isOpen && session) {
      setUnreadCount(0);
      markMessagesAsRead();
    }
  }, [isOpen, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const markMessagesAsRead = () => {
    if (socket && session) {
      console.log('Marking messages as read for session:', session.session_id);
      socket.emit('mark_messages_read', {
        session_id: session.session_id,
        order_code: orderCode,
      });
    }
  };

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    const messageData = {
      session_id: session.session_id,
      sender_type: 'buyer',
      sender_id: 241, // Use fixed ID for now, should be dynamic based on order
      message: newMessage,
    };

    console.log('Sending message with data:', messageData);

    try {
      const res = await fetch(`${backendUrl}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        const newMsg = await res.json();
        console.log('Message sent successfully:', newMsg);

        // Add message to local state
        setMessages((prev) => [...prev, newMsg]);
        setNewMessage('');

        // Emit via socket to broadcast to admin
        if (socket) {
          socket.emit('send_message', newMsg);
        }
      } else {
        const errorText = await res.text();
        console.error('Failed to send message, response:', errorText);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !session) return;

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
        session_id: session.session_id,
        sender_type: 'buyer',
        sender_id: 241, // Use fixed ID for now
        message: '',
        file_url: e.target.result,
        file_type: processedFile.type,
      };

      try {
        const res = await fetch(`${backendUrl}/api/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (res.ok) {
          const newMsg = await res.json();
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

  const handleTyping = (typing) => {
    if (socket && session) {
      socket.emit('typing', {
        session_id: session.session_id,
        order_code: orderCode,
        typing,
      });

      if (typing) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          socket.emit('typing', {
            session_id: session.session_id,
            order_code: orderCode,
            typing: false,
          });
        }, 3000);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMessageStatus = (message) => {
    if (message.sender_type === 'admin') return null;

    if (message.read_at) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }

    return adminOnline ? (
      <CheckCheck className="w-3 h-3 text-gray-400" />
    ) : (
      <Check className="w-3 h-3 text-gray-400" />
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!orderCode) {
    return null;
  }

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
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col">
            <div className="p-3 bg-blue-500 text-white rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">CS</span>
                  </div>
                  {adminOnline && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">Customer Service</p>
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

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
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
                  disabled={!session}
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
                  placeholder={session ? 'Ketik pesan...' : 'Menghubungkan...'}
                  disabled={!session}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !session}
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
