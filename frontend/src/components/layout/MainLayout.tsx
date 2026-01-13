import React from 'react';
import { Header } from './Header';
import { RoomList } from './RoomList';
import { OnlineUsersSidebar } from './OnlineUsersSidebar';
import './MainLayout.css';

// Mock data for demonstration
const MOCK_ROOMS = [
  { id: 1, title: 'K-Pop Karaoke Night 🎤', mode: 'KARAOKE', hostNickname: 'DJ_Sori', memberCount: 5, maxMembers: 8 },
  { id: 2, title: 'English/Japanese Exchange', mode: 'TRANSLATION', hostNickname: 'Kenji', memberCount: 3, maxMembers: 6 },
  { id: 3, title: 'Chill Lo-Fi Study', mode: 'SESSION', hostNickname: 'Beats', memberCount: 2, maxMembers: 10 },
  { id: 4, title: 'Anime Opening Songs Only', mode: 'KARAOKE', hostNickname: 'OtakuKing', memberCount: 7, maxMembers: 8 },
];

const MOCK_USERS = [
  { id: 1, nickname: 'Alice', status: 'online' as const },
  { id: 2, nickname: 'Bob', status: 'idle' as const },
  { id: 3, nickname: 'Charlie', status: 'online' as const },
  { id: 4, nickname: 'Dave', status: 'offline' as const },
];

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header 
        user={{ nickname: 'GuestUser' }}
        onSearch={(q) => console.log('Searching:', q)} 
      />
      
      <div className="layout-body">
        <main className="layout-content">
          {/* If children provided, render them. Otherwise render RoomList as default view */}
          {children || (
            <RoomList 
              rooms={MOCK_ROOMS} 
              onCreateRoom={() => console.log('Create Room Clicked')}
              onJoinRoom={(id) => console.log('Joining room', id)}
            />
          )}
        </main>
        
        <aside className="layout-sidebar">
          <OnlineUsersSidebar users={MOCK_USERS} />
        </aside>
      </div>
    </div>
  );
};
