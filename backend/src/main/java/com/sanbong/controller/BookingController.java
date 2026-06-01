package com.sanbong.controller;

import com.sanbong.dto.request.BookingRequest;
import com.sanbong.dto.request.ReviewRequest;
import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.AvailabilityResponse;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.ReviewResponse;
import com.sanbong.security.UserPrincipal;
import com.sanbong.service.interfaces.IBookingService;
import com.sanbong.service.interfaces.IFieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.createBooking(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đặt sân thành công", booking));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUserBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BookingResponse> bookings = bookingService.getUserBookings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse review = bookingService.createReview(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đánh giá thành công", review));
    }
}
