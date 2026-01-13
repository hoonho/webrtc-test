package com.example.backend.repository;

import com.example.backend.domain.Track;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackRepository extends JpaRepository<Track, Long> {
	List<Track> findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(String title, String artist);
}
