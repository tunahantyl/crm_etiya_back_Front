package com.boran.crm.controller;

import com.boran.crm.domain.application.UserService;
import com.boran.crm.domain.entity.User;
import com.boran.crm.domain.web.AuthResponse;
import com.boran.crm.domain.web.LoginRequest;
import com.boran.crm.domain.web.RegisterRequest;
import com.boran.crm.domain.web.UserResponse;
import com.boran.crm.domain.web.UserUpdateRequest;
import com.boran.crm.domain.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    // Authentication endpoints
    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // User management endpoints
    @GetMapping("/users/me")
    public ResponseEntity<UserResponse> getCurrentUser(Principal principal) {
        User user = userService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(userMapper.userToUserResponse(user));
    }

    @PutMapping("/users/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            Principal principal,
            @RequestBody UserUpdateRequest updateRequest
    ) {
        User updatedUser = userMapper.userUpdateRequestToUser(updateRequest);
        User user = userService.updateUser(principal.getName(), updatedUser);
        return ResponseEntity.ok(userMapper.userToUserResponse(user));
    }

    // Admin only endpoints
    @GetMapping("/users/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(user -> ResponseEntity.ok(userMapper.userToUserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users/{email}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateUser(@PathVariable String email) {
        userService.deactivateUser(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{email}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateUser(@PathVariable String email) {
        userService.activateUser(email);
        return ResponseEntity.ok().build();
    }
}