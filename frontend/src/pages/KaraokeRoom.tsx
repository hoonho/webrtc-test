import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoGrid } from '../components/room/VideoGrid';
import { YouTubePlayer } from '../components/room/YouTubePlayer';
import { ChatPanel } from '../components/room/ChatPanel';
import { RoomControls } from '../components/room/RoomControls';
import { useJanusVideoRoom } from '../hooks/useJanusVideoRoom';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage } from '../types';
import './KaraokeRoom.css';

// Janus server URL - direct connection (same as janus_client/videoroomtest.js)
const JANUS_SERVER_URL = 'https://janus.jsflux.co.kr/janus';

export const KaraokeRoom: React.FC = () => {
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

  // Mock chat for UI demonstration
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const dummyMessages: ChatMessage[] = [
      { id: '1', oderId: 'system', nickname: 'System', content: 'Welcome to Karaoke Room!', timestamp: new Date().toISOString() },
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
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave the room?')) {
      disconnect();
      navigate('/');
    }
  };

  return (
    <div className="karaoke-room">
      <header className="room-header">
        <div className="header-left">
          <div className="back-button" onClick={() => navigate('/')}>←</div>
          <div className="room-info">
            <h1>Karaoke Night 🎤</h1>
            <span className="room-id">
              ID: {roomId || numericRoomId}
              {isConnected && <span className="connection-status connected"> • Connected</span>}
              {!isConnected && <span className="connection-status connecting"> • Connecting...</span>}
            </span>
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

      <div className="room-layout">
        <div className="side-column left">
          <VideoGrid members={members.slice(0, 4)} position="left" />
        </div>

        <div className="center-column">
          <div className="youtube-section">
            <YouTubePlayer />
          </div>
          <div className="chat-section">
            <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>

        <div className="side-column right">
          <VideoGrid members={members.slice(4, 8)} position="right" />
        </div>
      </div>
    </div>
  );
};
