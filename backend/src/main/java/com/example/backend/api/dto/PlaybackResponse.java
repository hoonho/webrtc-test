package com.example.backend.api.dto;

import java.time.LocalDateTime;

public class PlaybackResponse {
	private Long roomId;
	private Long trackId;
	private String trackTitle;
	private long positionMs;
	private boolean playing;
	private LocalDateTime updatedAt;

	public PlaybackResponse(Long roomId, Long trackId, String trackTitle, long positionMs, boolean playing,
			LocalDateTime updatedAt) {
		this.roomId = roomId;
		this.trackId = trackId;
		this.trackTitle = trackTitle;
		this.positionMs = positionMs;
		this.playing = playing;
		this.updatedAt = updatedAt;
	}

	public Long getRoomId() {
		return roomId;
	}

	public Long getTrackId() {
		return trackId;
	}

	public String getTrackTitle() {
		return trackTitle;
	}

	public long getPositionMs() {
		return positionMs;
	}

	public boolean isPlaying() {
		return playing;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
}
