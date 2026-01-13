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
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(
		name = "room_member",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_room_member_room_user", columnNames = {"room_id", "user_id"})
		}
)
public class RoomMember {

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
	private RoomRole role;

	@Column(name = "joined_at", nullable = false)
	private LocalDateTime joinedAt;

	@Column(nullable = false)
	private boolean muted;

	@Column(name = "device_info", length = 500)
	private String deviceInfo;

	protected RoomMember() {
	}

	public RoomMember(Room room, AppUser user, RoomRole role, boolean muted, String deviceInfo) {
		this.room = room;
		this.user = user;
		this.role = role;
		this.muted = muted;
		this.deviceInfo = deviceInfo;
		this.joinedAt = LocalDateTime.now();
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

	public RoomRole getRole() {
		return role;
	}

	public LocalDateTime getJoinedAt() {
		return joinedAt;
	}

	public boolean isMuted() {
		return muted;
	}

	public String getDeviceInfo() {
		return deviceInfo;
	}
}
