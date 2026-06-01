package com.sanbong.service.impl;

import com.sanbong.dto.request.LoginRequest;
import com.sanbong.dto.request.SignupRequest;
import com.sanbong.dto.response.AuthResponse;
import com.sanbong.dto.response.UserResponse;
import com.sanbong.entity.User;
import com.sanbong.enums.Role;
import com.sanbong.exception.BadRequestException;
import com.sanbong.repository.UserRepository;
import com.sanbong.security.JwtTokenProvider;
import com.sanbong.security.UserPrincipal;
import com.sanbong.service.interfaces.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse signin(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return AuthResponse.of(jwt, UserResponse.from(user));
    }

    @Override
    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        User user = new User(
                request.hoTen(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.soDienThoai(),
                Role.USER
        );

        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }
}
