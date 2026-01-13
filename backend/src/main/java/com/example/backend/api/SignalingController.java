package com.example.backend.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;
import java.util.HashSet;

@Slf4j
@Controller
@RequiredArgsConstructor
public class SignalingController {

    private final SimpMessagingTemplate messagingTemplate;
    
    // Track users in each room
    private final Map<String, Set<UserInfo>> roomUsers = new ConcurrentHashMap<>();

    public static class UserInfo {
        public String oderId;
        public String odername;
        public String sessionId;
        
        public UserInfo() {}
        
        public UserInfo(String oderId, String odername, String sessionId) {
            this.oderId = oderId;
            this.odername = odername;
            this.sessionId = sessionId;
        }
    }

    public static class JoinRoomMessage {
        public String roomId;
        public String oderId;
        public String odername;
    }

    public static class SignalMessage {
        public String targetUserId;
        public Object signal;
        public UserInfo from;
    }

    public static class ChatMessagePayload {
        public String roomId;
        public String oderId;
        public String nickname;
        public String content;
        public String timestamp;
    }

    @MessageMapping("/room/{roomId}/join")
    public void joinRoom(@DestinationVariable String roomId, 
                        @Payload JoinRoomMessage message,
                        SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        UserInfo user = new UserInfo(message.oderId, message.odername, sessionId);
        
        roomUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(user);
        
        log.info("User {} joined room {}", message.odername, roomId);
        
        // Notify others in the room
        messagingTemplate.convertAndSend(
            "/topic/room/" + roomId + "/user-joined",
            user
        );
        
        // Send current room users to the new user
        messagingTemplate.convertAndSendToUser(
            sessionId,
            "/queue/room-users",
            roomUsers.get(roomId)
        );
    }

    @MessageMapping("/room/{roomId}/signal")
    public void signal(@DestinationVariable String roomId, 
                      @Payload SignalMessage message) {
        log.debug("Signal from {} to {}", message.from.odername, message.targetUserId);
        
        // Send signal to specific user
        messagingTemplate.convertAndSend(
            "/topic/room/" + roomId + "/signal/" + message.targetUserId,
            message
        );
    }

    @MessageMapping("/room/{roomId}/leave")
    public void leaveRoom(@DestinationVariable String roomId, 
                         @Payload UserInfo user) {
        Set<UserInfo> users = roomUsers.get(roomId);
        if (users != null) {
            users.removeIf(u -> u.oderId.equals(user.oderId));
            log.info("User {} left room {}", user.odername, roomId);
            
            // Notify others
            messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/user-left",
                user
            );
        }
    }

    @MessageMapping("/room/{roomId}/chat")
    @SendTo("/topic/room/{roomId}/chat")
    public ChatMessagePayload chat(@DestinationVariable String roomId,
                                   @Payload ChatMessagePayload message) {
        log.debug("Chat in room {}: {} - {}", roomId, message.nickname, message.content);
        return message;
    }
}
