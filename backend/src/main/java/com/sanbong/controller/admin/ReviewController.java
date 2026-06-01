package com.sanbong.controller.admin;

import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.ReviewResponse;
import com.sanbong.service.interfaces.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IBookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        List<ReviewResponse> reviews = bookingService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByField(
            @PathVariable Long fieldId) {
        List<ReviewResponse> reviews = bookingService.getReviewsByField(fieldId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        bookingService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đánh giá thành công", null));
    }
}
