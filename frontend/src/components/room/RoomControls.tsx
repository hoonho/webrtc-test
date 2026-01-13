import React from 'react';
import './RoomControls.css';

interface RoomControlsProps {
  isMuted: boolean;
  isCameraOn: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onLeaveRoom: () => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({
  isMuted,
  isCameraOn,
  onToggleMute,
  onToggleCamera,
  onLeaveRoom
}) => {
  return (
    <div className="room-controls">
      <button 
        className={`control-btn ${isMuted ? 'active' : ''}`} 
        onClick={onToggleMute}
        title={isMuted ? "Unmute" : "Mute"}
      >
        <span className="icon">{isMuted ? '🔇' : '🎤'}</span>
      </button>

      <button 
        className={`control-btn ${!isCameraOn ? 'active' : ''}`} 
        onClick={onToggleCamera}
        title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
      >
        <span className="icon">{isCameraOn ? '📷' : '🚫'}</span>
      </button>

      <div className="divider" />

      <button 
        className="control-btn leave" 
        onClick={onLeaveRoom}
        title="Leave Room"
      >
        <span className="icon">🚪</span>
        <span className="label">Leave</span>
      </button>
    </div>
  );
};
