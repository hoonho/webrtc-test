package com.example.backend.api.dto;

import com.example.backend.domain.RoomRole;
import java.time.LocalDateTime;

public class RoomMemberResponse {
	private Long id;
	private Long userId;
	private String nickname;
	private RoomRole role;
	private boolean muted;
	private String deviceInfo;
	private LocalDateTime joinedAt;

	public RoomMemberResponse(Long id, Long userId, String nickname, RoomRole role, boolean muted, String deviceInfo,
			LocalDateTime joinedAt) {
		this.id = id;
		this.userId = userId;
		this.nickname = nickname;
		this.role = role;
		this.muted = muted;
		this.deviceInfo = deviceInfo;
		this.joinedAt = joinedAt;
	}

	public Long getId() {
		return id;
	}

	public Long getUserId() {
		return userId;
	}

	public String getNickname() {
		return nickname;
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

	public LocalDateTime getJoinedAt() {
		return joinedAt;
	}
}
