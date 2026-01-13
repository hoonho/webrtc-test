import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { Instance as SimplePeerInstance } from 'simple-peer';
import { io, Socket } from 'socket.io-client';

interface PeerConnection {
  oderId: string;
  odername: string;
  peer: SimplePeerInstance;
  stream?: MediaStream;
}

interface UseWebRTCOptions {
  roomId: string;
  oderId: string;
  odername: string;
  serverUrl?: string;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  peers: Map<string, PeerConnection>;
  isMuted: boolean;
  isCameraOn: boolean;
  isConnected: boolean;
  error: string | null;
  toggleMute: () => void;
  toggleCamera: () => void;
  startCall: () => Promise<void>;
  endCall: () => void;
}

export function useWebRTC({
  roomId,
  oderId,
  odername,
  serverUrl = 'http://localhost:8080',
}: UseWebRTCOptions): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Get local media stream
  const getLocalStream = useCallback(async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      setError('카메라/마이크 접근 권한이 필요합니다.');
      throw err;
    }
  }, []);

  // Create peer connection
  const createPeer = useCallback(
    (targetUserId: string, targetUsername: string, initiator: boolean, stream: MediaStream): SimplePeerInstance => {
      const peer = new Peer({
        initiator,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peer.on('signal', (signal) => {
        socketRef.current?.emit('signal', {
          targetUserId,
          signal,
          from: { oderId, odername },
        });
      });

      peer.on('stream', (remoteStream) => {
        const peerConnection = peersRef.current.get(targetUserId);
        if (peerConnection) {
          peerConnection.stream = remoteStream;
          setPeers(new Map(peersRef.current));
        }
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        peersRef.current.delete(targetUserId);
        setPeers(new Map(peersRef.current));
      });

      peer.on('close', () => {
        peersRef.current.delete(targetUserId);
        setPeers(new Map(peersRef.current));
      });

      const peerConnection: PeerConnection = {
        oderId: targetUserId,
        odername: targetUsername,
        peer,
      };

      peersRef.current.set(targetUserId, peerConnection);
      setPeers(new Map(peersRef.current));

      return peer;
    },
    [oderId, odername]
  );

  // Start WebRTC call
  const startCall = useCallback(async () => {
    try {
      const stream = await getLocalStream();

      // Connect to signaling server
      socketRef.current = io(serverUrl, {
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        // Join room
        socketRef.current?.emit('join-room', {
          roomId,
          oderId,
          odername,
        });
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });

      // When a new user joins
      socketRef.current.on('user-joined', ({ oderId: newUserId, odername: newUsername }) => {
        console.log('User joined:', newUsername);
        // Create peer as initiator
        createPeer(newUserId, newUsername, true, stream);
      });

      // When receiving a signal from another peer
      socketRef.current.on('signal', ({ from, signal }) => {
        const existingPeer = peersRef.current.get(from.oderId);
        
        if (existingPeer) {
          existingPeer.peer.signal(signal);
        } else {
          // Create peer as non-initiator
          const peer = createPeer(from.oderId, from.odername, false, stream);
          peer.signal(signal);
        }
      });

      // When a user leaves
      socketRef.current.on('user-left', ({ oderId: leftUserId }) => {
        const peerConnection = peersRef.current.get(leftUserId);
        if (peerConnection) {
          peerConnection.peer.destroy();
          peersRef.current.delete(leftUserId);
          setPeers(new Map(peersRef.current));
        }
      });

      // Receive existing users in the room
      socketRef.current.on('room-users', (users: Array<{ oderId: string; odername: string }>) => {
        users.forEach((user) => {
          if (user.oderId !== oderId) {
            createPeer(user.oderId, user.odername, true, stream);
          }
        });
      });

    } catch (err) {
      console.error('Failed to start call:', err);
      setError('통화 시작에 실패했습니다.');
    }
  }, [roomId, oderId, odername, serverUrl, getLocalStream, createPeer]);

  // End call
  const endCall = useCallback(() => {
    // Stop all tracks
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    localStreamRef.current = null;

    // Destroy all peer connections
    peersRef.current.forEach((peerConnection) => {
      peerConnection.peer.destroy();
    });
    peersRef.current.clear();
    setPeers(new Map());

    // Disconnect socket
    socketRef.current?.disconnect();
    socketRef.current = null;

    setIsConnected(false);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!audioTracks[0]?.enabled);
    }
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(videoTracks[0]?.enabled ?? false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    localStream,
    peers,
    isMuted,
    isCameraOn,
    isConnected,
    error,
    toggleMute,
    toggleCamera,
    startCall,
    endCall,
  };
}
