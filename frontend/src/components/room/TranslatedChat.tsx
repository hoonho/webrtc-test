import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SUPPORTED_LANGUAGES } from '../../types';
import './TranslatedChat.css';

interface TranslatedChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  userLanguage: string;
}

const LANGUAGE_FLAGS: Record<string, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
};

export const TranslatedChat: React.FC<TranslatedChatProps> = ({ messages, onSendMessage, userLanguage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const getLanguageFlag = (code?: string) => {
    if (!code) return '🌐';
    return LANGUAGE_FLAGS[code] || '🌐';
  };

  return (
    <div className="translated-chat-panel">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.nickname === 'Me' ? 'own' : ''}`}>
            <div className="message-header">
              <span className="sender-flag">{getLanguageFlag(msg.originalLanguage)}</span>
              <span className="sender-name">{msg.nickname}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="message-body">
              {msg.originalContent && (
                <div className="original-content">
                  <span className="lang-label">Original:</span>
                  {msg.originalContent}
                </div>
              )}
              <div className="translated-content">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type a message in ${SUPPORTED_LANGUAGES.find(l => l.code === userLanguage)?.name || 'your language'}...`}
          />
          <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
            <span className="send-icon">➤</span>
          </button>
        </div>
      </form>
    </div>
  );
};
