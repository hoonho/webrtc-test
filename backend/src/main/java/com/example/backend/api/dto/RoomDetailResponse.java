package com.example.backend.api.dto;

import com.example.backend.domain.RoomMode;
import com.example.backend.domain.RoomVisibility;
import java.time.LocalDateTime;
import java.util.List;

public class RoomDetailResponse {
	private Long id;
	private String title;
	private RoomMode mode;
	private RoomVisibility visibility;
	private String hostNickname;
	private LocalDateTime createdAt;
	private List<RoomMemberResponse> members;

	public RoomDetailResponse(Long id, String title, RoomMode mode, RoomVisibility visibility, String hostNickname,
			LocalDateTime createdAt, List<RoomMemberResponse> members) {
		this.id = id;
		this.title = title;
		this.mode = mode;
		this.visibility = visibility;
		this.hostNickname = hostNickname;
		this.createdAt = createdAt;
		this.members = members;
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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public List<RoomMemberResponse> getMembers() {
		return members;
	}
}
