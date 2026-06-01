package com.sanbong.controller.admin;

import com.sanbong.dto.request.BookingRequest;
import com.sanbong.dto.request.ReviewRequest;
import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.ReviewResponse;
import com.sanbong.enums.BookingStatus;
import com.sanbong.service.interfaces.IBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final IBookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Long fieldId) {
        
        List<BookingResponse> bookings;
        
        if (date != null) {
            bookings = bookingService.getBookingsByDate(date);
        } else if (status != null) {
            bookings = bookingService.getBookingsByStatus(status);
        } else if (fieldId != null) {
            bookings = bookingService.getBookingsByField(fieldId);
        } else {
            bookings = bookingService.getAllBookings();
        }
        
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<BookingResponse>> approveBooking(@PathVariable Long id) {
        BookingResponse booking = bookingService.approveBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Duyệt booking thành công", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        BookingResponse booking = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Hủy booking thành công", booking));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BookingResponse>> completeBooking(@PathVariable Long id) {
        BookingResponse booking = bookingService.completeBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Hoàn tất booking thành công", booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa booking thành công", null));
    }
}
