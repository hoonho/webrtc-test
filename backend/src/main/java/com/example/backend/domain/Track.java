package com.example.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "track")
public class Track {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "source_type", nullable = false, length = 20)
	private TrackSourceType sourceType;

	@Column(nullable = false, length = 200)
	private String title;

	@Column(length = 200)
	private String artist;

	@Column(name = "duration_seconds")
	private Integer durationSeconds;

	@Column(length = 500)
	private String url;

	@Column(name = "metadata_json")
	private String metadataJson;

	protected Track() {
	}

	public Track(TrackSourceType sourceType, String title, String artist, Integer durationSeconds, String url, String metadataJson) {
		this.sourceType = sourceType;
		this.title = title;
		this.artist = artist;
		this.durationSeconds = durationSeconds;
		this.url = url;
		this.metadataJson = metadataJson;
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

	public String getMetadataJson() {
		return metadataJson;
	}
}
