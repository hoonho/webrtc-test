package com.example.backend.repository;

import com.example.backend.domain.QueueItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueItemRepository extends JpaRepository<QueueItem, Long> {
	List<QueueItem> findByRoomIdOrderBySortOrderAsc(Long roomId);
}
