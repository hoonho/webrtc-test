package com.example.backend.api.dto;

import java.time.LocalDateTime;

public class UserResponse {
	private Long id;
	private String email;
	private String nickname;
	private String provider;
	private LocalDateTime createdAt;

	public UserResponse(Long id, String email, String nickname, String provider, LocalDateTime createdAt) {
		this.id = id;
		this.email = email;
		this.nickname = nickname;
		this.provider = provider;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getNickname() {
		return nickname;
	}

	public String getProvider() {
		return provider;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
