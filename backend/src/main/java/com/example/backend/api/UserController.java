package com.example.backend.api;

import com.example.backend.api.dto.UserResponse;
import com.example.backend.domain.AppUser;
import com.example.backend.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UserController {

	private final AppUserRepository appUserRepository;

	public UserController(AppUserRepository appUserRepository) {
		this.appUserRepository = appUserRepository;
	}

	@GetMapping("/me")
	public UserResponse me(@RequestParam(name = "userId", required = false) Long userId) {
		Long id = userId == null ? 1L : userId;
		AppUser user = appUserRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		return new UserResponse(user.getId(), user.getEmail(), user.getNickname(), user.getProvider(), user.getCreatedAt());
	}
}
