package com.example.backend.repository;

import com.example.backend.domain.RoomMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
	List<RoomMember> findByRoomId(Long roomId);
	Optional<RoomMember> findByRoomIdAndUserId(Long roomId, Long userId);
	long countByRoomId(Long roomId);
	void deleteByRoomIdAndUserId(Long roomId, Long userId);
}
