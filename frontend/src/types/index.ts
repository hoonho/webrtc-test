// Room Types
export type RoomType = 'KARAOKE' | 'TRANSLATION';

export interface Room {
  id: string;
  title: string;
  type: RoomType;
  hostId: string;
  hostNickname: string;
  memberCount: number;
  maxMembers: number;
  isPrivate: boolean;
  language?: string; // for translation rooms
  createdAt: string;
}

export interface RoomMember {
  id: string;
  oderId: string;
  nickname: string;
  profileImage?: string;
  isMuted: boolean;
  isCameraOn: boolean;
  isLocal?: boolean;
  stream?: MediaStream;
}

// User Types
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  oderId: string;
  nickname: string;
  content: string;
  originalContent?: string; // for translation rooms
  originalLanguage?: string;
  translatedLanguage?: string;
  timestamp: string;
}

// WebRTC Types
export interface PeerConnection {
  oderId: string;
  peer: any; // SimplePeer instance
  stream?: MediaStream;
}

// Language options for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
