import React, { useState } from 'react';
import './Header.css';

interface HeaderProps {
  user?: {
    nickname: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user = { nickname: 'Guest' }, 
  onSearch,
  onLogin,
  onLogout
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-logo">VR</div>
        <span className="brand-name">VoiceRoom</span>
      </div>

      <div className="header-search">
        <svg 
          className="search-icon" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for karaoke or translation rooms..." 
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className="header-actions">
        <button className="action-btn has-notification" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        <div className="profile-menu">
          <div className="profile-avatar">
            {user.nickname.slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user.nickname}</span>
            <span className="profile-status">Online</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </header>
  );
};
