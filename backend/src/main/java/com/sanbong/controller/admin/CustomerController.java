package com.sanbong.controller.admin;

import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.UserResponse;
import com.sanbong.entity.User;
import com.sanbong.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllCustomers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> customers = users.stream()
                .filter(u -> u.getRole() != com.sanbong.enums.Role.ADMIN)
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(customers));
    }
}
