package com.sanbong.service.interfaces;

import com.sanbong.dto.request.UpdateUserRequest;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.UserResponse;

import java.util.List;

public interface IUserService {
    
    UserResponse getCurrentUser(Long userId);
    
    UserResponse updateUser(Long userId, UpdateUserRequest request);
    
    List<BookingResponse> getUserBookings(Long userId);
    
    void cancelBooking(Long userId, Long bookingId);
}
