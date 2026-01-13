package com.example.backend.api;

import com.example.backend.api.dto.PlaybackResponse;
import com.example.backend.api.dto.PlaybackUpdateRequest;
import com.example.backend.domain.PlaybackState;
import com.example.backend.domain.Room;
import com.example.backend.domain.Track;
import com.example.backend.repository.PlaybackStateRepository;
import com.example.backend.repository.RoomRepository;
import com.example.backend.repository.TrackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/rooms/{roomId}/playback")
public class PlaybackController {

	private final PlaybackStateRepository playbackStateRepository;
	private final RoomRepository roomRepository;
	private final TrackRepository trackRepository;

	public PlaybackController(PlaybackStateRepository playbackStateRepository, RoomRepository roomRepository,
			TrackRepository trackRepository) {
		this.playbackStateRepository = playbackStateRepository;
		this.roomRepository = roomRepository;
		this.trackRepository = trackRepository;
	}

	@GetMapping
	public PlaybackResponse getPlayback(@PathVariable Long roomId) {
		PlaybackState state = playbackStateRepository.findById(roomId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Playback not found"));
		return new PlaybackResponse(
				state.getRoomId(),
				state.getTrack() == null ? null : state.getTrack().getId(),
				state.getTrack() == null ? null : state.getTrack().getTitle(),
				state.getPositionMs(),
				state.isPlaying(),
				state.getUpdatedAt());
	}

	@PatchMapping
	public PlaybackResponse updatePlayback(@PathVariable Long roomId, @RequestBody PlaybackUpdateRequest request) {
		Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
		Track track = request.getTrackId() == null ? null : trackRepository.findById(request.getTrackId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found"));
		PlaybackState state = playbackStateRepository.findById(roomId)
				.orElseGet(() -> new PlaybackState(room, track, request.getPositionMs(), request.isPlaying()));
		state.update(track, request.getPositionMs(), request.isPlaying());
		PlaybackState saved = playbackStateRepository.save(state);
		return new PlaybackResponse(
				saved.getRoomId(),
				saved.getTrack() == null ? null : saved.getTrack().getId(),
				saved.getTrack() == null ? null : saved.getTrack().getTitle(),
				saved.getPositionMs(),
				saved.isPlaying(),
				saved.getUpdatedAt());
	}
}
