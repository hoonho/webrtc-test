package com.example.backend.api.dto;

import com.example.backend.domain.QueueStatus;

public class QueueAddRequest {
	private Long trackId;
	private Long requestedBy;
	private QueueStatus status;
	private Integer sortOrder;

	public Long getTrackId() {
		return trackId;
	}

	public Long getRequestedBy() {
		return requestedBy;
	}

	public QueueStatus getStatus() {
		return status;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}
}
