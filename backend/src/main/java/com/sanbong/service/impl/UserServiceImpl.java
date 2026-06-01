package com.sanbong.service.impl;

import com.sanbong.dto.request.UpdateUserRequest;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.UserResponse;
import com.sanbong.entity.Booking;
import com.sanbong.entity.User;
import com.sanbong.enums.BookingStatus;
import com.sanbong.exception.BadRequestException;
import com.sanbong.exception.ResourceNotFoundException;
import com.sanbong.repository.BookingRepository;
import com.sanbong.repository.UserRepository;
import com.sanbong.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setHoTen(request.hoTen());
        if (request.soDienThoai() != null) {
            user.setSoDienThoai(request.soDienThoai());
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.from(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Bạn không có quyền hủy booking này");
        }

        if (booking.getStatus() == BookingStatus.DA_HUY) {
            throw new BadRequestException("Booking đã được hủy trước đó");
        }

        booking.setStatus(BookingStatus.DA_HUY);
        bookingRepository.save(booking);
    }
}
