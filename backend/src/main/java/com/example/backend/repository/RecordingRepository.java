package com.example.backend.repository;

import com.example.backend.domain.Recording;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordingRepository extends JpaRepository<Recording, Long> {
	List<Recording> findByRoomId(Long roomId);
}
