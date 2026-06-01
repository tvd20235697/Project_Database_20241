package com.sanbong.dto.response;

import com.sanbong.entity.Review;
import java.time.LocalDate;

public record ReviewResponse(
    Long id,
    Long bookingId,
    UserResponse user,
    Long fieldId,
    String fieldName,
    Integer diemSo,
    String noiDung,
    LocalDate ngayTao
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getBooking() != null ? review.getBooking().getId() : null,
            review.getUser() != null ? UserResponse.from(review.getUser()) : null,
            review.getField() != null ? review.getField().getId() : null,
            review.getField() != null ? review.getField().getTenSan() : null,
            review.getDiemSo(),
            review.getNoiDung(),
            review.getNgayTao()
        );
    }
}
