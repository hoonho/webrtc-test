package com.example.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "playback_state")
public class PlaybackState {

	@Id
	private Long roomId;

	@OneToOne(optional = false)
	@MapsId
	@JoinColumn(name = "room_id")
	private Room room;

	@OneToOne
	@JoinColumn(name = "track_id")
	private Track track;

	@Column(name = "position_ms", nullable = false)
	private long positionMs;

	@Column(name = "is_playing", nullable = false)
	private boolean playing;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	protected PlaybackState() {
	}

	public PlaybackState(Room room, Track track, long positionMs, boolean playing) {
		this.room = room;
		this.track = track;
		this.positionMs = positionMs;
		this.playing = playing;
		this.updatedAt = LocalDateTime.now();
	}

	public Long getRoomId() {
		return roomId;
	}

	public Room getRoom() {
		return room;
	}

	public Track getTrack() {
		return track;
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

	public void update(Track track, long positionMs, boolean playing) {
		this.track = track;
		this.positionMs = positionMs;
		this.playing = playing;
		this.updatedAt = LocalDateTime.now();
	}
}
