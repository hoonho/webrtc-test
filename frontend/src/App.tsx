import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { RoomList } from './components/layout/RoomList';
import { OnlineUsersSidebar } from './components/layout/OnlineUsersSidebar';
import CreateRoomModal from './components/common/CreateRoomModal';
import { KaraokeRoom } from './pages/KaraokeRoom';
import { TranslationRoom } from './pages/TranslationRoom';
import { AuthPage } from './pages/AuthPage';
import { RoomType } from './types';
import * as api from './services/api';
import './App.css';

interface RoomListItem {
  id: number;
  title: string;
  mode: 'KARAOKE' | 'TRANSLATION';
  hostNickname: string;
  memberCount: number;
  maxMembers: number;
}

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Main page component with room list
function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await api.getRooms();
        const roomList: RoomListItem[] = response.map(r => ({
          id: r.id,
          title: r.title,
          mode: r.mode,
          hostNickname: r.hostNickname,
          memberCount: r.memberCount,
          maxMembers: 8,
        }));
        setRooms(roomList);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError('Failed to load rooms. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
    // Refresh every 10 seconds
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = useCallback(async (data: { 
    title: string; 
    type: RoomType; 
    isPrivate: boolean; 
    language?: string 
  }) => {
    if (!user) return;
    
    try {
      const response = await api.createRoom({
        title: data.title,
        mode: data.type,
        visibility: data.isPrivate ? 'PRIVATE' : 'PUBLIC',
        hostId: Number(user.id),
      });
      
      // Navigate to the created room
      if (data.type === 'KARAOKE') {
        navigate(`/karaoke/${response.id}`);
      } else {
        navigate(`/translation/${response.id}`);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('Failed to create room');
    }
  }, [user, navigate]);

  const handleJoinRoom = useCallback(async (roomId: number) => {
    if (!user) return;
    
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      try {
        // Try to join the room via API
        await api.joinRoom(roomId, {
          userId: Number(user.id),
          deviceInfo: navigator.userAgent,
        });
      } catch (err) {
        // Ignore conflict error (already joined)
        const message = err instanceof Error ? err.message : '';
        if (!message.includes('already joined')) {
          console.error('Failed to join room:', err);
        }
      }
      
      if (room.mode === 'KARAOKE') {
        navigate(`/karaoke/${room.id}`);
      } else {
        navigate(`/translation/${room.id}`);
      }
    }
  }, [rooms, user, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/auth');
  }, [logout, navigate]);

  const filteredRooms = rooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.hostNickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-layout">
      <Header 
        user={user ? { nickname: user.nickname } : undefined}
        onSearch={setSearchQuery}
        onLogout={handleLogout}
      />
      
      <div className="layout-body">
        <main className="layout-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <RoomList 
              rooms={filteredRooms} 
              onCreateRoom={() => setIsModalOpen(true)}
              onJoinRoom={handleJoinRoom}
            />
          )}
        </main>
        
        <aside className="layout-sidebar">
          <OnlineUsersSidebar users={[]} />
        </aside>
      </div>

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/karaoke/:roomId" element={
            <ProtectedRoute>
              <KaraokeRoom />
            </ProtectedRoute>
          } />
          <Route path="/translation/:roomId" element={
            <ProtectedRoute>
              <TranslationRoom />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
