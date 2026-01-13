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
@Table(name = "queue_item")
public class QueueItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	@ManyToOne(optional = false)
	@JoinColumn(name = "track_id", nullable = false)
	private Track track;

	@ManyToOne(optional = false)
	@JoinColumn(name = "requested_by", nullable = false)
	private AppUser requestedBy;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private QueueStatus status;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	protected QueueItem() {
	}

	public QueueItem(Room room, Track track, AppUser requestedBy, QueueStatus status, int sortOrder) {
		this.room = room;
		this.track = track;
		this.requestedBy = requestedBy;
		this.status = status;
		this.sortOrder = sortOrder;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public Room getRoom() {
		return room;
	}

	public Track getTrack() {
		return track;
	}

	public AppUser getRequestedBy() {
		return requestedBy;
	}

	public QueueStatus getStatus() {
		return status;
	}

	public int getSortOrder() {
		return sortOrder;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void update(QueueStatus status, int sortOrder) {
		this.status = status;
		this.sortOrder = sortOrder;
	}
}
