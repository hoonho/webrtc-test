package com.example.backend.api.dto;

public class PlaybackUpdateRequest {
	private Long trackId;
	private long positionMs;
	private boolean playing;

	public Long getTrackId() {
		return trackId;
	}

	public long getPositionMs() {
		return positionMs;
	}

	public boolean isPlaying() {
		return playing;
	}
}
