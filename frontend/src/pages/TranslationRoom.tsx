import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoGrid } from '../components/room/VideoGrid';
import { TranslatedChat } from '../components/room/TranslatedChat';
import { RoomControls } from '../components/room/RoomControls';
import { useJanusVideoRoom } from '../hooks/useJanusVideoRoom';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage, SUPPORTED_LANGUAGES, LanguageCode } from '../types';
import './TranslationRoom.css';

// Janus server URL - direct connection (same as janus_client/videoroomtest.js)
const JANUS_SERVER_URL = 'https://janus.jsflux.co.kr/janus';

export const TranslationRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const numericRoomId = useMemo(() => Number(roomId || 1234), [roomId]);
  const displayName = user?.nickname || 'Guest';

  const {
    members,
    isConnected,
    isMuted,
    isCameraOn,
    toggleMute,
    toggleCamera,
    disconnect,
    error,
  } = useJanusVideoRoom({
    serverUrl: JANUS_SERVER_URL,
    roomId: numericRoomId,
    displayName,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userLanguage, setUserLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    const dummyMessages: ChatMessage[] = [
      {
        id: '1',
        oderId: '2',
        nickname: 'Tanaka',
        content: 'Hello, how are you?',
        originalContent: 'こんにちは、元気ですか？',
        originalLanguage: 'ja',
        translatedLanguage: 'en',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: '2',
        oderId: '7',
        nickname: 'Kim',
        content: 'I am doing well! The weather is nice.',
        originalContent: '안녕하세요, 잘 지내세요? 날씨가 좋네요.',
        originalLanguage: 'ko',
        translatedLanguage: 'en',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ];
    setMessages(dummyMessages);
  }, []);

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Janus error:', error);
    }
  }, [error]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      oderId: 'local',
      nickname: displayName || 'Me',
      content,
      originalContent: content,
      originalLanguage: userLanguage,
      translatedLanguage: userLanguage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave the translation room?')) {
      disconnect();
      navigate('/');
    }
  };

  return (
    <div className="translation-room">
      <header className="room-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/')}
          >
            <span className="icon">←</span>
          </button>
          <div className="room-info">
            <div className="room-title-wrapper">
              <h1>Global Summit 🌍</h1>
              <span className="room-badge">Translation Active</span>
            </div>
            <span className="room-id">
              ID: {roomId || numericRoomId}
              {isConnected && <span className="connection-status connected"> • Connected</span>}
              {!isConnected && <span className="connection-status connecting"> • Connecting...</span>}
            </span>
          </div>
        </div>

        <div className="header-center">
          <div className="language-selector">
            <span className="lang-label">Translate to:</span>
            <select
              value={userLanguage}
              onChange={(e) => setUserLanguage(e.target.value as LanguageCode)}
              className="lang-select"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <RoomControls
          isMuted={isMuted}
          isCameraOn={isCameraOn}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
          onLeaveRoom={handleLeaveRoom}
        />
      </header>

      <div className="room-content">
        <div className="video-column left">
          <VideoGrid members={members.slice(0, 4)} position="left" />
        </div>

        <div className="center-panel">
          <TranslatedChat messages={messages} onSendMessage={handleSendMessage} userLanguage={userLanguage} />
        </div>

        <div className="video-column right">
          <VideoGrid members={members.slice(4, 8)} position="right" />
        </div>
      </div>
    </div>
  );
};
