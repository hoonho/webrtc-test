package com.example.backend.api.dto;

import com.example.backend.domain.QueueStatus;
import java.time.LocalDateTime;

public class QueueItemResponse {
	private Long id;
	private Long trackId;
	private String trackTitle;
	private String trackArtist;
	private Long requestedBy;
	private QueueStatus status;
	private int sortOrder;
	private LocalDateTime createdAt;

	public QueueItemResponse(Long id, Long trackId, String trackTitle, String trackArtist, Long requestedBy,
			QueueStatus status, int sortOrder, LocalDateTime createdAt) {
		this.id = id;
		this.trackId = trackId;
		this.trackTitle = trackTitle;
		this.trackArtist = trackArtist;
		this.requestedBy = requestedBy;
		this.status = status;
		this.sortOrder = sortOrder;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public Long getTrackId() {
		return trackId;
	}

	public String getTrackTitle() {
		return trackTitle;
	}

	public String getTrackArtist() {
		return trackArtist;
	}

	public Long getRequestedBy() {
		return requestedBy;
	}

	public QueueStatus getStatus() {
		return status;
	}

	public int getSortOrder() {
		return sortOrder;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
