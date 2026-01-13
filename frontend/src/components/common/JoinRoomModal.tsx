import React, { useState, useEffect } from 'react';
import './CreateRoomModal.css'; // Reuse existing modal styles

interface JoinRoomModalProps {
  isOpen: boolean;
  roomId: string;
  roomType: 'karaoke' | 'translation';
  onJoin: (nickname: string) => void;
  onCancel: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  roomId,
  roomType,
  onJoin,
  onCancel,
}) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNickname('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('Please enter a nickname');
      return;
    }
    
    // Allow alphanumeric and Korean characters
    if (!/^[a-zA-Z0-9가-힣]+$/.test(trimmed)) {
      setError('Nickname can only contain letters, numbers, or Korean characters');
      return;
    }
    
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError('Nickname must be 2-20 characters');
      return;
    }
    
    onJoin(trimmed);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const roomIcon = roomType === 'karaoke' ? '🎤' : '🌐';
  const roomTitle = roomType === 'karaoke' ? 'Karaoke Room' : 'Translation Room';

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{roomIcon}</div>
          <h2 className="modal-title">Join {roomTitle}</h2>
          <p className="modal-subtitle">Room ID: {roomId}</p>
        </div>

        <form className="room-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Nickname</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your nickname..."
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              autoFocus
              maxLength={20}
            />
            {error && (
              <span style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
                {error}
              </span>
            )}
          </div>

          <div style={{ 
            background: 'rgba(52, 211, 255, 0.1)', 
            border: '1px solid rgba(52, 211, 255, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            color: 'var(--muted)'
          }}>
            <strong style={{ color: 'var(--text)' }}>💡 Tip:</strong> Users with the same Room ID will be connected together for video calls.
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!nickname.trim()}>
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
