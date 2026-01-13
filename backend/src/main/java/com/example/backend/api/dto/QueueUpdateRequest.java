package com.example.backend.api.dto;

import com.example.backend.domain.QueueStatus;

public class QueueUpdateRequest {
	private QueueStatus status;
	private Integer sortOrder;

	public QueueStatus getStatus() {
		return status;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}
}
