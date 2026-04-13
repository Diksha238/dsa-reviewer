package com.dsareviewer.dsa_reviewer.service;

import com.dsareviewer.dsa_reviewer.dto.*;
import com.dsareviewer.dsa_reviewer.model.User;
import com.dsareviewer.dsa_reviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Email already registered! Please login instead.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(
                token, user.getName(), user.getEmail());
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password!");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(
                token, user.getName(), user.getEmail());
    }
}
