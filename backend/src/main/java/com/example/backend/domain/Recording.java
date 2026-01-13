package com.example.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "recording")
public class Recording {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	@ManyToOne(optional = false)
	@JoinColumn(name = "owner_id", nullable = false)
	private AppUser owner;

	@Column(name = "storage_url", nullable = false, length = 500)
	private String storageUrl;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	protected Recording() {
	}

	public Recording(Room room, AppUser owner, String storageUrl) {
		this.room = room;
		this.owner = owner;
		this.storageUrl = storageUrl;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public Room getRoom() {
		return room;
	}

	public AppUser getOwner() {
		return owner;
	}

	public String getStorageUrl() {
		return storageUrl;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
