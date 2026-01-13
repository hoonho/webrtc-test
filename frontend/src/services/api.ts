// 개발환경에서는 직접 백엔드 URL 사용, 프로덕션에서는 환경변수 사용
const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8082/api'
  : (process.env.REACT_APP_API_BASE || '/api');

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  provider: string;
  createdAt: string;
}

export interface RoomResponse {
  id: number;
  title: string;
  mode: 'KARAOKE' | 'TRANSLATION';
  visibility: 'PUBLIC' | 'PRIVATE';
  hostNickname: string;
  memberCount: number;
  createdAt: string;
}

export interface RoomDetailResponse extends RoomResponse {
  members: RoomMemberResponse[];
}

export interface RoomMemberResponse {
  id: number;
  userId: number;
  nickname: string;
  role: string;
  muted: boolean;
  deviceInfo: string;
  joinedAt: string;
}

// Auth API
export async function register(email: string, password: string, nickname: string): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, nickname }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Invalid email or password');
  }
  return res.json();
}

// Room API
export async function getRooms(): Promise<RoomResponse[]> {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) {
    throw new Error('Failed to fetch rooms');
  }
  return res.json();
}

export async function getRoom(roomId: number): Promise<RoomDetailResponse> {
  const res = await fetch(`${API_BASE}/rooms/${roomId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch room');
  }
  return res.json();
}

export async function createRoom(data: {
  title: string;
  mode: 'KARAOKE' | 'TRANSLATION';
  visibility: 'PUBLIC' | 'PRIVATE';
  passwordHash?: string;
  hostId: number;
}): Promise<RoomResponse> {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create room');
  }
  return res.json();
}

export async function joinRoom(roomId: number, data: {
  userId: number;
  role?: string;
  muted?: boolean;
  deviceInfo?: string;
}): Promise<RoomMemberResponse> {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to join room' }));
    throw new Error(error.message || 'Failed to join room');
  }
  return res.json();
}

export async function leaveRoom(roomId: number, userId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    throw new Error('Failed to leave room');
  }
}
