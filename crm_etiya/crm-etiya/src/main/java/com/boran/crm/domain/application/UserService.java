package com.boran.crm.domain.application;

import com.boran.crm.domain.entity.User;
import com.boran.crm.domain.web.AuthResponse;
import com.boran.crm.domain.web.LoginRequest;
import com.boran.crm.domain.web.RegisterRequest;

import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    Optional<User> findByEmail(String email);
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getCurrentUser(String email);
    User updateUser(String email, User updatedUser);
    void deactivateUser(String email);
    void activateUser(String email);
    
    // Dashboard statistics
    long countAllUsers();
    long countActiveUsers();
}
