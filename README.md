# webrtc-test

## Quick start

### Backend (Spring Boot + H2)

```bash
cd backend
./gradlew bootRun
```

- API base: `http://localhost:8080`
- H2 console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/webrtc`
- User: `sa` (password empty)

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

## Sample API calls

```bash
curl http://localhost:8080/api/rooms
curl http://localhost:8080/api/rooms/1
curl "http://localhost:8080/api/tracks/search?query=light"
```
