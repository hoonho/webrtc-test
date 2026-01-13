package com.example.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(
		name = "app_user",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_app_user_email", columnNames = "email")
		}
)
public class AppUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 255)
	private String email;

	@Column(nullable = false, length = 255)
	private String password;

	@Column(nullable = false, length = 100)
	private String nickname;

	@Column(nullable = false, length = 30)
	private String provider;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	protected AppUser() {
	}

	public AppUser(String email, String password, String nickname, String provider) {
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.provider = provider;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getProvider() {
		return provider;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
