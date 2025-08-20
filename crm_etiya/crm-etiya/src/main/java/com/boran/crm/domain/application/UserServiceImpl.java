package com.boran.crm.domain.application;

import com.boran.crm.domain.entity.User;
import com.boran.crm.domain.entity.Role;
import com.boran.crm.domain.repository.UserRepository;
import com.boran.crm.domain.web.AuthResponse;
import com.boran.crm.domain.web.LoginRequest;
import com.boran.crm.domain.web.RegisterRequest;
import com.boran.crm.domain.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Email kullanımda mı kontrol et
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // MapStruct ile User oluştur ve eksik alanları set et
        User user = userMapper.registerRequestToUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        user.setActive(true);

        // Kullanıcıyı kaydet
        userRepository.save(user);

        // JWT token oluştur
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Kimlik doğrulama
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Kullanıcıyı bul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kullanıcı aktif mi kontrol et
        if (!user.isActive()) {
            throw new RuntimeException("User account is disabled");
        }

        // JWT token oluştur
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public User getCurrentUser(String email) {
        return findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @Override
    public User updateUser(String email, User updatedUser) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    if (updatedUser.getFullName() != null) {
                        user.setFullName(updatedUser.getFullName());
                    }
                    // Password güncellemesi varsa
                    if (updatedUser.getPassword() != null) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void deactivateUser(String email) {
        userRepository.findByEmail(email)
                .map(user -> {
                    user.setActive(false);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void activateUser(String email) {
        userRepository.findByEmail(email)
                .map(user -> {
                    user.setActive(true);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public long countAllUsers() {
        return userRepository.count();
    }

    @Override
    public long countActiveUsers() {
        return userRepository.countByIsActive(true);
    }
}