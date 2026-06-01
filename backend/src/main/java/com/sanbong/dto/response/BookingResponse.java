package com.sanbong.dto.response;

import com.sanbong.entity.Booking;
import com.sanbong.enums.BookingStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
    Long id,
    UserResponse user,
    FieldResponse field,
    TimeSlotResponse timeSlot,
    LocalDate ngay,
    BookingStatus status,
    String ghiChu,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    ReviewResponse review
) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getUser() != null ? UserResponse.from(booking.getUser()) : null,
            FieldResponse.fromBasic(booking.getField()),
            TimeSlotResponse.from(booking.getTimeSlot()),
            booking.getNgay(),
            booking.getStatus(),
            booking.getGhiChu(),
            booking.getCreatedAt(),
            booking.getUpdatedAt(),
            booking.getReview() != null ? ReviewResponse.from(booking.getReview()) : null
        );
    }

    public static BookingResponse fromBasic(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            null,
            null,
            null,
            booking.getNgay(),
            booking.getStatus(),
            booking.getGhiChu(),
            booking.getCreatedAt(),
            booking.getUpdatedAt(),
            null
        );
    }
}
