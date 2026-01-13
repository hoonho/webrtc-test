# Backend Structure Guide

## Spring Boot + WebSocket + JPA

### Project Structure
```
backend/
├── src/main/java/com/example/backend/
│   ├── BackendApplication.java          # Main entry point
│   ├── config/
│   │   ├── WebConfig.java               # CORS configuration
│   │   └── WebSocketConfig.java         # WebSocket STOMP configuration
│   ├── api/
│   │   ├── RoomController.java          # Room REST API
│   │   ├── UserController.java          # User REST API
│   │   ├── TrackController.java         # Track search API
│   │   ├── PlaybackController.java      # Playback state API
│   │   ├── SignalingController.java     # WebRTC signaling (WebSocket)
│   │   └── dto/                         # Request/Response DTOs
│   └── domain/
│       ├── Room.java                    # Room entity
│       ├── RoomMode.java                # KARAOKE | TRANSLATION
│       ├── RoomMember.java              # Room membership
│       ├── AppUser.java                 # User entity
│       ├── ChatMessage.java             # Chat messages
│       └── ...
└── src/main/resources/
    └── application.properties
```

### API Endpoints

#### REST API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List all rooms |
| POST | `/api/rooms` | Create new room |
| GET | `/api/rooms/{id}` | Get room details |
| POST | `/api/rooms/{id}/join` | Join room |
| POST | `/api/rooms/{id}/leave` | Leave room |
| GET | `/api/users/me` | Get current user |

#### WebSocket Endpoints (STOMP)
| Destination | Direction | Description |
|-------------|-----------|-------------|
| `/app/room/{roomId}/join` | Client→Server | Join a room |
| `/app/room/{roomId}/signal` | Client→Server | Send WebRTC signal |
| `/app/room/{roomId}/leave` | Client→Server | Leave room |
| `/app/room/{roomId}/chat` | Client→Server | Send chat message |
| `/topic/room/{roomId}/user-joined` | Server→Client | User joined notification |
| `/topic/room/{roomId}/user-left` | Server→Client | User left notification |
| `/topic/room/{roomId}/signal/{userId}` | Server→Client | WebRTC signal relay |
| `/topic/room/{roomId}/chat` | Server→Client | Chat message broadcast |

### Running the Backend

```bash
cd backend
./gradlew bootRun
```

- API: `http://localhost:8080`
- WebSocket: `ws://localhost:8080/ws`
- H2 Console: `http://localhost:8080/h2-console`

### WebSocket Connection (Frontend)

```typescript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    // Subscribe to room events
    client.subscribe('/topic/room/123/user-joined', message => {
      const user = JSON.parse(message.body);
      console.log('User joined:', user);
    });
    
    // Join room
    client.publish({
      destination: '/app/room/123/join',
      body: JSON.stringify({ roomId: '123', userId: '1', username: 'Alice' })
    });
  }
});

client.activate();
```

### WebRTC Signaling Flow

1. User A joins room → Server broadcasts `user-joined` to all
2. User B receives `user-joined` → Creates RTCPeerConnection as initiator
3. User B generates offer → Sends to `/app/room/{roomId}/signal`
4. Server relays offer to User A via `/topic/room/{roomId}/signal/{userAId}`
5. User A receives offer → Creates answer → Sends back via signal
6. ICE candidates exchanged similarly until connection established

### Translation Integration (Future)

For real-time translation in TRANSLATION rooms:
1. Frontend sends chat with `originalLanguage` field
2. Backend calls Google Cloud Translation API
3. Translated message broadcasted with `translatedContent`

```java
// Example Translation Service
@Service
public class TranslationService {
    public String translate(String text, String targetLang) {
        // Call Google Cloud Translation API
        return translatedText;
    }
}
```

### Environment Variables

```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:h2:file:./data/webrtc
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=update

# Google Cloud Translation (optional)
google.cloud.project-id=your-project-id
google.cloud.credentials=path/to/credentials.json
```
