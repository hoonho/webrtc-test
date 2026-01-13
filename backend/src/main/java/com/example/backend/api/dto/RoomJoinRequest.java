package com.example.backend.api.dto;

import com.example.backend.domain.RoomRole;

public class RoomJoinRequest {
	private Long userId;
	private RoomRole role;
	private boolean muted;
	private String deviceInfo;

	public Long getUserId() {
		return userId;
	}

	public RoomRole getRole() {
		return role;
	}

	public boolean isMuted() {
		return muted;
	}

	public String getDeviceInfo() {
		return deviceInfo;
	}
}
