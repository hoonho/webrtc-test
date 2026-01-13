package com.example.backend.api.dto;

import com.example.backend.domain.RoomMode;
import com.example.backend.domain.RoomVisibility;

public class RoomCreateRequest {
	private String title;
	private RoomMode mode;
	private RoomVisibility visibility;
	private String passwordHash;
	private Long hostId;

	public String getTitle() {
		return title;
	}

	public RoomMode getMode() {
		return mode;
	}

	public RoomVisibility getVisibility() {
		return visibility;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public Long getHostId() {
		return hostId;
	}
}
