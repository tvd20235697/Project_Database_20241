package com.sanbong.service.interfaces;

import com.sanbong.dto.request.BookingRequest;
import com.sanbong.dto.request.ReviewRequest;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.ReviewResponse;
import com.sanbong.enums.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface IBookingService {
    
    BookingResponse createBooking(Long userId, BookingRequest request);
    
    List<BookingResponse> getUserBookings(Long userId);
    
    List<BookingResponse> getAllBookings();
    
    List<BookingResponse> getBookingsByDate(LocalDate date);
    
    List<BookingResponse> getBookingsByStatus(BookingStatus status);
    
    List<BookingResponse> getBookingsByField(Long fieldId);
    
    BookingResponse getBookingById(Long id);
    
    BookingResponse approveBooking(Long id);
    
    BookingResponse cancelBooking(Long id);
    
    BookingResponse completeBooking(Long id);
    
    void deleteBooking(Long id);
    
    ReviewResponse createReview(Long userId, ReviewRequest request);
    
    List<ReviewResponse> getAllReviews();
    
    List<ReviewResponse> getReviewsByField(Long fieldId);
    
    void deleteReview(Long id);
}
