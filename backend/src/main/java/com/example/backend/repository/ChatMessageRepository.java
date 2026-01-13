package com.example.backend.repository;

import com.example.backend.domain.ChatMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
	List<ChatMessage> findTop50ByRoomIdOrderByCreatedAtDesc(Long roomId);
}
