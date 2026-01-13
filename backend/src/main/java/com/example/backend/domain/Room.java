package com.example.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "room")
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 200)
	private String title;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private RoomMode mode;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private RoomVisibility visibility;

	@Column(name = "password_hash", length = 255)
	private String passwordHash;

	@ManyToOne(optional = false)
	@JoinColumn(name = "host_id", nullable = false)
	private AppUser host;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	protected Room() {
	}

	public Room(String title, RoomMode mode, RoomVisibility visibility, String passwordHash, AppUser host) {
		this.title = title;
		this.mode = mode;
		this.visibility = visibility;
		this.passwordHash = passwordHash;
		this.host = host;
		this.createdAt = LocalDateTime.now();
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

	public String getPasswordHash() {
		return passwordHash;
	}

	public AppUser getHost() {
		return host;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
