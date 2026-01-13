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
@Table(name = "chat_message")
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	@ManyToOne(optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private AppUser user;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ChatMessageType type;

	@Column(nullable = false, length = 2000)
	private String content;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	protected ChatMessage() {
	}

	public ChatMessage(Room room, AppUser user, ChatMessageType type, String content) {
		this.room = room;
		this.user = user;
		this.type = type;
		this.content = content;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public Room getRoom() {
		return room;
	}

	public AppUser getUser() {
		return user;
	}

	public ChatMessageType getType() {
		return type;
	}

	public String getContent() {
		return content;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
