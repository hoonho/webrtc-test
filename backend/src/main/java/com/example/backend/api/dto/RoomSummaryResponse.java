package com.example.backend.api.dto;

import com.example.backend.domain.RoomMode;
import com.example.backend.domain.RoomVisibility;
import java.time.LocalDateTime;

public class RoomSummaryResponse {
	private Long id;
	private String title;
	private RoomMode mode;
	private RoomVisibility visibility;
	private String hostNickname;
	private long memberCount;
	private LocalDateTime createdAt;

	public RoomSummaryResponse(Long id, String title, RoomMode mode, RoomVisibility visibility, String hostNickname,
			long memberCount, LocalDateTime createdAt) {
		this.id = id;
		this.title = title;
		this.mode = mode;
		this.visibility = visibility;
		this.hostNickname = hostNickname;
		this.memberCount = memberCount;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public RoomMode getMode() {
		return mode;
	}

	public RoomVisibility getVisibility() {
		return visibility;
	}

	public String getHostNickname() {
		return hostNickname;
	}

	public long getMemberCount() {
		return memberCount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
