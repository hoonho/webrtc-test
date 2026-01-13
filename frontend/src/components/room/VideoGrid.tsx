import React, { useEffect, useRef } from 'react';
import { RoomMember } from '../../types';
import './VideoGrid.css';

interface VideoGridProps {
  members: RoomMember[];
  position: 'left' | 'right';
}

interface VideoSlotProps {
  member: RoomMember | null;
  index: number;
}

const VideoSlot: React.FC<VideoSlotProps> = ({ member, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && member?.stream) {
      videoRef.current.srcObject = member.stream;
    }
  }, [member?.stream]);

  if (!member) {
    return (
      <div className="video-slot">
        <div className="empty-slot">
          <span>Waiting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-slot">
      <div className="member-video">
        {member.stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={member.isLocal}
          />
        ) : (
          <div className="avatar-placeholder">
            {member.profileImage ? (
              <img src={member.profileImage} alt={member.nickname} />
            ) : (
              <div className="avatar-initial">{member.nickname[0]}</div>
            )}
          </div>
        )}
        
        <div className="member-info">
          <span className="nickname">{member.nickname}</span>
          {member.isMuted && <span className="mute-icon">🔇</span>}
        </div>
        
        <div className={`connection-indicator ${member.stream ? 'connected' : 'connecting'}`} />
      </div>
    </div>
  );
};

export const VideoGrid: React.FC<VideoGridProps> = ({ members, position }) => {
  const slots = Array(4).fill(null).map((_, index) => members[index] || null);

  return (
    <div className={`video-grid ${position}`}>
      {slots.map((member, index) => (
        <VideoSlot
          key={member ? member.id : `empty-${index}`}
          member={member}
          index={index}
        />
      ))}
    </div>
  );
};
