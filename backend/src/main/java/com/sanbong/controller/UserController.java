package com.sanbong.controller;

import com.sanbong.dto.request.UpdateUserRequest;
import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.UserResponse;
import com.sanbong.security.UserPrincipal;
import com.sanbong.service.interfaces.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse userResponse = userService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse userResponse = userService.updateUser(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", userResponse));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUserBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BookingResponse> bookings = userService.getUserBookings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        userService.cancelBooking(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Hủy booking thành công", null));
    }
}
