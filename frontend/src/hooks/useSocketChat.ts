import { useState, useRef, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../types';

interface UseSocketChatOptions {
  roomId: string;
  oderId: string;
  odername: string;
  serverUrl?: string;
  onTranslate?: (text: string, targetLang: string) => Promise<string>;
}

interface UseSocketChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  isConnected: boolean;
}

export function useSocketChat({
  roomId,
  oderId,
  odername,
  serverUrl = 'http://localhost:8082',
  onTranslate,
}: UseSocketChatOptions): UseSocketChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to chat server
    socketRef.current = io(`${serverUrl}/chat`, {
      transports: ['websocket'],
      query: { roomId, oderId, odername },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Receive chat messages
    socketRef.current.on('chat-message', async (message: ChatMessage) => {
      // If translation is enabled, translate the message
      if (onTranslate && message.originalLanguage) {
        try {
          const translated = await onTranslate(message.content, 'ko'); // Translate to user's language
          message.content = translated;
          message.translatedLanguage = 'ko';
        } catch (err) {
          console.error('Translation failed:', err);
        }
      }
      
      setMessages((prev) => [...prev, message]);
    });

    // Receive chat history when joining
    socketRef.current.on('chat-history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, oderId, odername, serverUrl, onTranslate]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !socketRef.current) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      oderId,
      nickname: odername,
      content: content.trim(),
      originalContent: content.trim(),
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit('chat-message', {
      roomId,
      message,
    });
  }, [roomId, oderId, odername]);

  return {
    messages,
    sendMessage,
    isConnected,
  };
}
