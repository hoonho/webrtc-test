package com.example.backend.repository;

import com.example.backend.domain.PlaybackState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaybackStateRepository extends JpaRepository<PlaybackState, Long> {
}
