package com.example.backend.api;

import com.example.backend.api.dto.QueueAddRequest;
import com.example.backend.api.dto.QueueItemResponse;
import com.example.backend.api.dto.QueueUpdateRequest;
import com.example.backend.api.dto.RoomCreateRequest;
import com.example.backend.api.dto.RoomDetailResponse;
import com.example.backend.api.dto.RoomJoinRequest;
import com.example.backend.api.dto.RoomLeaveRequest;
import com.example.backend.api.dto.RoomMemberResponse;
import com.example.backend.api.dto.RoomSummaryResponse;
import com.example.backend.domain.AppUser;
import com.example.backend.domain.QueueItem;
import com.example.backend.domain.QueueStatus;
import com.example.backend.domain.Room;
import com.example.backend.domain.RoomMember;
import com.example.backend.domain.RoomRole;
import com.example.backend.domain.Track;
import com.example.backend.repository.AppUserRepository;
import com.example.backend.repository.QueueItemRepository;
import com.example.backend.repository.RoomMemberRepository;
import com.example.backend.repository.RoomRepository;
import com.example.backend.repository.TrackRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/rooms")
public class RoomController {

	private final RoomRepository roomRepository;
	private final RoomMemberRepository roomMemberRepository;
	private final AppUserRepository appUserRepository;
	private final TrackRepository trackRepository;
	private final QueueItemRepository queueItemRepository;

	public RoomController(RoomRepository roomRepository, RoomMemberRepository roomMemberRepository,
			AppUserRepository appUserRepository, TrackRepository trackRepository, QueueItemRepository queueItemRepository) {
		this.roomRepository = roomRepository;
		this.roomMemberRepository = roomMemberRepository;
		this.appUserRepository = appUserRepository;
		this.trackRepository = trackRepository;
		this.queueItemRepository = queueItemRepository;
	}

	@GetMapping
	public List<RoomSummaryResponse> listRooms() {
		return roomRepository.findAll().stream()
				.map(room -> new RoomSummaryResponse(
						room.getId(),
						room.getTitle(),
						room.getMode(),
						room.getVisibility(),
						room.getHost().getNickname(),
						roomMemberRepository.countByRoomId(room.getId()),
						room.getCreatedAt()))
				.collect(Collectors.toList());
	}

	@PostMapping
	public RoomSummaryResponse createRoom(@RequestBody RoomCreateRequest request) {
		AppUser host = appUserRepository.findById(request.getHostId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host not found"));
		Room room = new Room(request.getTitle(), request.getMode(), request.getVisibility(), request.getPasswordHash(), host);
		Room saved = roomRepository.save(room);
		RoomMember hostMember = new RoomMember(saved, host, RoomRole.HOST, false, "host device");
		roomMemberRepository.save(hostMember);
		return new RoomSummaryResponse(
				saved.getId(),
				saved.getTitle(),
				saved.getMode(),
				saved.getVisibility(),
				saved.getHost().getNickname(),
				roomMemberRepository.countByRoomId(saved.getId()),
				saved.getCreatedAt());
	}

	@GetMapping("/{roomId}")
	public RoomDetailResponse getRoom(@PathVariable Long roomId) {
		Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
		List<RoomMemberResponse> members = roomMemberRepository.findByRoomId(roomId).stream()
				.map(member -> new RoomMemberResponse(
						member.getId(),
						member.getUser().getId(),
						member.getUser().getNickname(),
						member.getRole(),
						member.isMuted(),
						member.getDeviceInfo(),
						member.getJoinedAt()))
				.collect(Collectors.toList());
		return new RoomDetailResponse(
				room.getId(),
				room.getTitle(),
				room.getMode(),
				room.getVisibility(),
				room.getHost().getNickname(),
				room.getCreatedAt(),
				members);
	}

	@PostMapping("/{roomId}/join")
	public RoomMemberResponse joinRoom(@PathVariable Long roomId, @RequestBody RoomJoinRequest request) {
		Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
		AppUser user = appUserRepository.findById(request.getUserId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		if (roomMemberRepository.findByRoomIdAndUserId(roomId, user.getId()).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "User already joined");
		}
		RoomRole role = Objects.requireNonNullElse(request.getRole(), RoomRole.PERFORMER);
		RoomMember member = new RoomMember(room, user, role, request.isMuted(), request.getDeviceInfo());
		RoomMember saved = roomMemberRepository.save(member);
		return new RoomMemberResponse(
				saved.getId(),
				user.getId(),
				user.getNickname(),
				saved.getRole(),
				saved.isMuted(),
				saved.getDeviceInfo(),
				saved.getJoinedAt());
	}

	@PostMapping("/{roomId}/leave")
	public void leaveRoom(@PathVariable Long roomId, @RequestBody RoomLeaveRequest request) {
		if (request.getUserId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
		}
		roomMemberRepository.deleteByRoomIdAndUserId(roomId, request.getUserId());
	}

	@GetMapping("/{roomId}/members")
	public List<RoomMemberResponse> listMembers(@PathVariable Long roomId) {
		return roomMemberRepository.findByRoomId(roomId).stream()
				.map(member -> new RoomMemberResponse(
						member.getId(),
						member.getUser().getId(),
						member.getUser().getNickname(),
						member.getRole(),
						member.isMuted(),
						member.getDeviceInfo(),
						member.getJoinedAt()))
				.collect(Collectors.toList());
	}

	@GetMapping("/{roomId}/queue")
	public List<QueueItemResponse> listQueue(@PathVariable Long roomId) {
		return queueItemRepository.findByRoomIdOrderBySortOrderAsc(roomId).stream()
				.map(item -> new QueueItemResponse(
						item.getId(),
						item.getTrack().getId(),
						item.getTrack().getTitle(),
						item.getTrack().getArtist(),
						item.getRequestedBy().getId(),
						item.getStatus(),
						item.getSortOrder(),
						item.getCreatedAt()))
				.collect(Collectors.toList());
	}

	@PostMapping("/{roomId}/queue")
	public QueueItemResponse addQueue(@PathVariable Long roomId, @RequestBody QueueAddRequest request) {
		Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
		Track track = trackRepository.findById(request.getTrackId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found"));
		AppUser requester = appUserRepository.findById(request.getRequestedBy())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		QueueStatus status = request.getStatus() == null ? QueueStatus.PENDING : request.getStatus();
		int sortOrder = request.getSortOrder() == null
				? queueItemRepository.findByRoomIdOrderBySortOrderAsc(roomId).size() + 1
				: request.getSortOrder();
		QueueItem saved = queueItemRepository.save(new QueueItem(room, track, requester, status, sortOrder));
		return new QueueItemResponse(
				saved.getId(),
				saved.getTrack().getId(),
				saved.getTrack().getTitle(),
				saved.getTrack().getArtist(),
				saved.getRequestedBy().getId(),
				saved.getStatus(),
				saved.getSortOrder(),
				saved.getCreatedAt());
	}

	@PatchMapping("/{roomId}/queue/{queueItemId}")
	public QueueItemResponse updateQueue(@PathVariable Long roomId, @PathVariable Long queueItemId,
			@RequestBody QueueUpdateRequest request) {
		QueueItem item = queueItemRepository.findById(queueItemId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Queue item not found"));
		if (!item.getRoom().getId().equals(roomId)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room mismatch");
		}
		QueueStatus status = request.getStatus() == null ? item.getStatus() : request.getStatus();
		int sortOrder = request.getSortOrder() == null ? item.getSortOrder() : request.getSortOrder();
		item.update(status, sortOrder);
		QueueItem updated = queueItemRepository.save(item);
		return new QueueItemResponse(
				updated.getId(),
				updated.getTrack().getId(),
				updated.getTrack().getTitle(),
				updated.getTrack().getArtist(),
				updated.getRequestedBy().getId(),
				updated.getStatus(),
				updated.getSortOrder(),
				updated.getCreatedAt());
	}
}
