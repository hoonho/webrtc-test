import { useCallback, useEffect, useRef, useState } from 'react';
import { RoomMember } from '../types';

// Janus is loaded globally via script tag in index.html
declare const Janus: any;

export interface UseJanusVideoRoomOptions {
  serverUrl: string;
  roomId: number;
  displayName: string;
}

export interface UseJanusVideoRoomReturn {
  members: RoomMember[];
  isConnected: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
}

// Janus initialization (singleton)
let janusInitialized = false;
let janusInitPromise: Promise<void> | null = null;

function initJanus(): Promise<void> {
  if (janusInitialized) return Promise.resolve();
  if (janusInitPromise) return janusInitPromise;
  
  janusInitPromise = new Promise((resolve) => {
    Janus.init({
      debug: 'all',
      callback: () => {
        janusInitialized = true;
        resolve();
      },
    });
  });
  return janusInitPromise;
}

export function useJanusVideoRoom(options: UseJanusVideoRoomOptions): UseJanusVideoRoomReturn {
  const { serverUrl, roomId, displayName } = options;

  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [members, setMembers] = useState<RoomMember[]>([]);

  const janusRef = useRef<any>(null);
  const pluginRef = useRef<any>(null);
  const myIdRef = useRef<number | null>(null);
  const myPvtIdRef = useRef<number | null>(null);
  const feedsRef = useRef<Map<number, any>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectedRef = useRef(false);

  // Update members list
  const updateMembers = useCallback(() => {
    const result: RoomMember[] = [];
    
    // Add local member
    if (localStreamRef.current) {
      result.push({
        id: 'local',
        oderId: 'local',
        nickname: displayName,
        isMuted,
        isCameraOn,
        isLocal: true,
        stream: localStreamRef.current,
      });
    }
    
    // Add remote members
    feedsRef.current.forEach((feed, id) => {
      if (feed.stream) {
        result.push({
          id: String(id),
          oderId: String(id),
          nickname: feed.rfdisplay || `User ${id}`,
          isMuted: false,
          isCameraOn: true,
          isLocal: false,
          stream: feed.stream,
        });
      }
    });
    
    setMembers(result);
  }, [displayName, isMuted, isCameraOn]);

  // Publish own feed (start camera/mic)
  const publishOwnFeed = useCallback(() => {
    if (!pluginRef.current) return;
    
    pluginRef.current.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: true, videoSend: true },
      success: (jsep: any) => {
        console.log('Got publisher SDP:', jsep);
        pluginRef.current.send({
          message: { request: 'configure', audio: true, video: true },
          jsep: jsep,
        });
      },
      error: (err: any) => {
        console.error('WebRTC error:', err);
        setError('카메라/마이크 접근에 실패했습니다.');
      },
    });
  }, []);

  // Subscribe to remote feed
  const subscribeToFeed = useCallback((id: number, display: string) => {
    if (!janusRef.current || feedsRef.current.has(id)) return;
    
    janusRef.current.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: 'videoroom-subscriber-' + Janus.randomString(12),
      success: (pluginHandle: any) => {
        const feed = {
          handle: pluginHandle,
          rfid: id,
          rfdisplay: display,
          stream: null as MediaStream | null,
        };
        feedsRef.current.set(id, feed);
        
        pluginHandle.send({
          message: {
            request: 'join',
            room: roomId,
            ptype: 'subscriber',
            feed: id,
            private_id: myPvtIdRef.current,
          },
        });
      },
      error: (err: any) => {
        console.error('Error attaching subscriber plugin:', err);
      },
      onmessage: (msg: any, jsep: any) => {
        if (jsep) {
          const feed = feedsRef.current.get(id);
          if (feed) {
            feed.handle.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false },
              success: (answerJsep: any) => {
                feed.handle.send({
                  message: { request: 'start', room: roomId },
                  jsep: answerJsep,
                });
              },
              error: (err: any) => {
                console.error('WebRTC subscriber error:', err);
              },
            });
          }
        }
      },
      onremotestream: (stream: MediaStream) => {
        console.log('Got remote stream for feed', id);
        const feed = feedsRef.current.get(id);
        if (feed) {
          feed.stream = stream;
          updateMembers();
        }
      },
      oncleanup: () => {
        feedsRef.current.delete(id);
        updateMembers();
      },
    });
  }, [roomId, updateMembers]);

  // Connect to Janus
  const connect = useCallback(async () => {
    if (connectedRef.current) return;
    connectedRef.current = true;
    
    try {
      await initJanus();
      
      if (!Janus.isWebrtcSupported()) {
        setError('이 브라우저는 WebRTC를 지원하지 않습니다.');
        return;
      }
      
      // Create Janus session
      janusRef.current = new Janus({
        server: serverUrl,
        success: () => {
          console.log('Janus session created');
          
          // Attach to VideoRoom plugin
          janusRef.current.attach({
            plugin: 'janus.plugin.videoroom',
            opaqueId: 'videoroom-publisher-' + Janus.randomString(12),
            success: (pluginHandle: any) => {
              pluginRef.current = pluginHandle;
              console.log('VideoRoom plugin attached');
              
              // Create room (ignore if exists)
              pluginHandle.send({
                message: {
                  request: 'create',
                  room: roomId,
                  permanent: false,
                  publishers: 6,
                  bitrate: 128000,
                  fir_freq: 10,
                  description: 'webrtc-test',
                  is_private: false,
                },
                success: () => {
                  // Join room as publisher
                  pluginHandle.send({
                    message: {
                      request: 'join',
                      room: roomId,
                      ptype: 'publisher',
                      display: displayName,
                    },
                  });
                },
              });
            },
            error: (err: any) => {
              console.error('Error attaching plugin:', err);
              setError('Janus 플러그인 연결에 실패했습니다.');
            },
            consentDialog: (on: boolean) => {
              console.log('Consent dialog:', on);
            },
            mediaState: (medium: string, on: boolean) => {
              console.log('Janus', on ? 'started' : 'stopped', 'receiving our', medium);
            },
            webrtcState: (on: boolean) => {
              console.log('WebRTC PeerConnection is', on ? 'up' : 'down');
            },
            onmessage: (msg: any, jsep: any) => {
              const event = msg.videoroom;
              console.log('VideoRoom event:', event, msg);
              
              if (msg.error) {
                console.error('VideoRoom error:', msg.error);
                if (msg.error_code !== 427) { // Ignore "room already exists"
                  setError(msg.error);
                }
              }
              
              if (event === 'joined') {
                myIdRef.current = msg.id;
                myPvtIdRef.current = msg.private_id;
                setIsConnected(true);
                console.log('Joined room', msg.room, 'as publisher', msg.id);
                
                // Publish own feed
                publishOwnFeed();
                
                // Subscribe to existing publishers
                if (msg.publishers) {
                  for (const pub of msg.publishers) {
                    subscribeToFeed(pub.id, pub.display);
                  }
                }
              } else if (event === 'event') {
                // New publishers
                if (msg.publishers) {
                  for (const pub of msg.publishers) {
                    subscribeToFeed(pub.id, pub.display);
                  }
                }
                // Publisher left
                if (msg.leaving) {
                  const feed = feedsRef.current.get(msg.leaving);
                  if (feed) {
                    feed.handle?.detach();
                    feedsRef.current.delete(msg.leaving);
                    updateMembers();
                  }
                }
                if (msg.unpublished) {
                  if (msg.unpublished === 'ok') {
                    pluginRef.current?.hangup();
                  } else {
                    const feed = feedsRef.current.get(msg.unpublished);
                    if (feed) {
                      feed.handle?.detach();
                      feedsRef.current.delete(msg.unpublished);
                      updateMembers();
                    }
                  }
                }
              }
              
              if (jsep) {
                pluginRef.current?.handleRemoteJsep({ jsep });
              }
            },
            onlocalstream: (stream: MediaStream) => {
              console.log('Got local stream:', stream);
              localStreamRef.current = stream;
              updateMembers();
            },
            onremotestream: () => {
              // Publisher is sendonly, not expected
            },
            oncleanup: () => {
              console.log('Publisher cleanup');
              localStreamRef.current = null;
              updateMembers();
            },
          });
        },
        error: (err: any) => {
          console.error('Janus error:', err);
          setError('Janus 서버 연결에 실패했습니다.');
          connectedRef.current = false;
        },
        destroyed: () => {
          console.log('Janus session destroyed');
          setIsConnected(false);
          connectedRef.current = false;
        },
      });
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Connection failed');
      connectedRef.current = false;
    }
  }, [serverUrl, roomId, displayName, publishOwnFeed, subscribeToFeed, updateMembers]);

  // Disconnect
  const disconnect = useCallback(() => {
    feedsRef.current.forEach((feed) => {
      try { feed.handle?.detach(); } catch {}
    });
    feedsRef.current.clear();
    
    try { pluginRef.current?.detach(); } catch {}
    pluginRef.current = null;
    
    try { janusRef.current?.destroy(); } catch {}
    janusRef.current = null;
    
    localStreamRef.current = null;
    myIdRef.current = null;
    myPvtIdRef.current = null;
    connectedRef.current = false;
    
    setIsConnected(false);
    setMembers([]);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!pluginRef.current) return;
    const muted = pluginRef.current.isAudioMuted();
    if (muted) {
      pluginRef.current.unmuteAudio();
      setIsMuted(false);
    } else {
      pluginRef.current.muteAudio();
      setIsMuted(true);
    }
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (!pluginRef.current) return;
    const muted = pluginRef.current.isVideoMuted();
    if (muted) {
      pluginRef.current.unmuteVideo();
      setIsCameraOn(true);
    } else {
      pluginRef.current.muteVideo();
      setIsCameraOn(false);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (displayName) {
      connect();
    }
    return () => {
      disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    members,
    isConnected,
    isMuted,
    isCameraOn,
    error,
    connect,
    disconnect,
    toggleMute,
    toggleCamera,
  };
}
