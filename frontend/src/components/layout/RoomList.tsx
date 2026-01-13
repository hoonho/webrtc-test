import React from 'react';
import './RoomList.css';

interface Room {
  id: number;
  title: string;
  mode: string; // 'KARAOKE' | 'TRANSLATION' | 'SESSION'
  hostNickname: string;
  memberCount: number;
  maxMembers?: number;
}

interface RoomListProps {
  rooms: Room[];
  onCreateRoom?: () => void;
  onJoinRoom?: (roomId: number) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  onCreateRoom,
  onJoinRoom 
}) => {
  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h2 className="section-headline">Live Rooms</h2>
        <button className="create-room-btn" onClick={onCreateRoom}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Room
        </button>
      </div>

      <div className="room-grid">
        {rooms.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            No active rooms found. Start one!
          </div>
        ) : (
          rooms.map((room) => (
            <div 
              key={room.id} 
              className="room-grid-card"
              onClick={() => onJoinRoom?.(room.id)}
            >
              <div className="card-header">
                <span className={`room-badge ${room.mode.toLowerCase()}`}>
                  {room.mode}
                </span>
              </div>
              
              <div>
                <h3 className="card-title">{room.title}</h3>
                <div className="card-host">
                  <div className="host-avatar">
                    {room.hostNickname.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="host-name">by {room.hostNickname}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="member-count">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {room.memberCount} / {room.maxMembers || 8}
                </div>
                <div className="join-hint">Join Room →</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
