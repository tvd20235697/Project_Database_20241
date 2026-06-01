package com.sanbong.service.interfaces;

import com.sanbong.dto.request.LoginRequest;
import com.sanbong.dto.request.SignupRequest;
import com.sanbong.dto.response.AuthResponse;
import com.sanbong.dto.response.UserResponse;

public interface IAuthService {
    
    AuthResponse signin(LoginRequest request);
    
    UserResponse signup(SignupRequest request);
}
