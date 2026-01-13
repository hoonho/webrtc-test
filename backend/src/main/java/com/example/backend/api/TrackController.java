package com.example.backend.api;

import com.example.backend.api.dto.TrackResponse;
import com.example.backend.repository.TrackRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tracks")
public class TrackController {

	private final TrackRepository trackRepository;

	public TrackController(TrackRepository trackRepository) {
		this.trackRepository = trackRepository;
	}

	@GetMapping("/search")
	public List<TrackResponse> search(@RequestParam(name = "query") String query) {
		return trackRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(query, query).stream()
				.map(track -> new TrackResponse(
						track.getId(),
						track.getSourceType(),
						track.getTitle(),
						track.getArtist(),
						track.getDurationSeconds(),
						track.getUrl()))
				.collect(Collectors.toList());
	}
}
