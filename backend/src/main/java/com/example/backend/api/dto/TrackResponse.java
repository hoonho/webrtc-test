package com.example.backend.api.dto;

import com.example.backend.domain.TrackSourceType;

public class TrackResponse {
	private Long id;
	private TrackSourceType sourceType;
	private String title;
	private String artist;
	private Integer durationSeconds;
	private String url;

	public TrackResponse(Long id, TrackSourceType sourceType, String title, String artist, Integer durationSeconds,
			String url) {
		this.id = id;
		this.sourceType = sourceType;
		this.title = title;
		this.artist = artist;
		this.durationSeconds = durationSeconds;
		this.url = url;
	}

	public Long getId() {
		return id;
	}

	public TrackSourceType getSourceType() {
		return sourceType;
	}

	public String getTitle() {
		return title;
	}

	public String getArtist() {
		return artist;
	}

	public Integer getDurationSeconds() {
		return durationSeconds;
	}

	public String getUrl() {
		return url;
	}
}
