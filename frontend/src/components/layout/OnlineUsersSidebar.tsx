import React from 'react';
import './OnlineUsersSidebar.css';

interface OnlineUser {
  id: number;
  nickname: string;
  status: 'online' | 'idle' | 'offline';
  avatar?: string;
}

interface OnlineUsersSidebarProps {
  users: OnlineUser[];
}

export const OnlineUsersSidebar: React.FC<OnlineUsersSidebarProps> = ({ users }) => {
  return (
    <aside className="online-sidebar">
      <div className="sidebar-title">
        Online Users
        <span className="user-count-badge">{users.length}</span>
      </div>
      
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-avatar-container">
              <div className="sidebar-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.nickname} />
                ) : (
                  user.nickname.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className={`status-indicator ${user.status}`} />
            </div>
            <div className="user-info">
              <span className="user-nickname">{user.nickname}</span>
              <span className="user-status-text">
                {user.status === 'online' ? 'Available' : user.status}
              </span>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
            No users online
          </div>
        )}
      </div>
    </aside>
  );
};
