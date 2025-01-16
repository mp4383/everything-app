import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface Message {
  id: string;
  chatId: string;
  userId: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  createChat: (title: string) => Promise<Chat>;
  selectChat: (chat: Chat | null) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { headers } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chats
  useEffect(() => {
    const loadChats = async () => {
      if (!headers) return;
      
      try {
        setLoading(true);
        const response = await api.getChats(headers);
        if (response.data?.data) {
          setChats(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load chats:', err);
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    if (headers) {
      loadChats();
    }
  }, [headers]);

  // Create new chat
  const createChat = useCallback(async (title: string): Promise<Chat> => {
    if (!headers) throw new Error('Not authenticated');

    try {
      setLoading(true);
      const response = await api.createChat({ title }, headers);
      if (!response.data?.data) {
        throw new Error('Invalid response from server');
      }
      const newChat = response.data.data;
      setChats(prev => [...prev, newChat]);
      setCurrentChat(newChat);
      setMessages([]);
      return newChat;
    } catch (err) {
      console.error('Failed to create chat:', err);
      setError('Failed to create chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [headers]);

  // Select chat and load messages
  const selectChat = useCallback(async (chat: Chat | null) => {
    if (!headers) return;

    try {
      setLoading(true);
      setCurrentChat(chat);
      if (chat) {
        const response = await api.getChatMessages(chat.id, headers);
        if (response.data?.data) {
          setMessages(response.data.data);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [headers]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!headers || !currentChat) return;

    try {
      setLoading(true);
      const response = await api.sendMessage(currentChat.id, { content }, headers);
      if (!response.data?.data) {
        throw new Error('Invalid response from server');
      }
      const { userMessage, assistantMessage } = response.data.data;
      setMessages(prev => [...prev, userMessage, assistantMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [headers, currentChat]);

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      messages,
      loading,
      error,
      createChat,
      selectChat,
      sendMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
