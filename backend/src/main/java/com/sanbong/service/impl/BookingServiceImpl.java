package com.sanbong.service.impl;

import com.sanbong.dto.request.BookingRequest;
import com.sanbong.dto.request.ReviewRequest;
import com.sanbong.dto.response.BookingResponse;
import com.sanbong.dto.response.ReviewResponse;
import com.sanbong.entity.*;
import com.sanbong.enums.BookingStatus;
import com.sanbong.exception.BadRequestException;
import com.sanbong.exception.ConflictException;
import com.sanbong.exception.ResourceNotFoundException;
import com.sanbong.repository.*;
import com.sanbong.service.interfaces.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements IBookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FieldRepository fieldRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Field field = fieldRepository.findById(request.fieldId())
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", request.fieldId()));

        TimeSlot timeSlot = timeSlotRepository.findById(request.timeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", request.timeSlotId()));

        if (!field.getId().equals(timeSlot.getField().getId())) {
            throw new BadRequestException("Khung giờ không thuộc sân đã chọn");
        }

        bookingRepository.findActiveBooking(request.fieldId(), request.timeSlotId(), request.ngay())
                .ifPresent(b -> {
                    throw new ConflictException("Sân này đã được đặt vào khung giờ và ngày đã chọn");
                });

        Booking booking = new Booking(user, field, timeSlot, request.ngay(), request.ghiChu());
        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponse.from(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByDate(LocalDate date) {
        return bookingRepository.findBookingsForDate(date).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByField(Long fieldId) {
        return bookingRepository.findByFieldId(fieldId).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return BookingResponse.from(booking);
    }

    @Override
    @Transactional
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getStatus() != BookingStatus.CHO_DUYET) {
            throw new BadRequestException("Chỉ có thể duyệt booking đang chờ duyệt");
        }

        booking.setStatus(BookingStatus.DA_DUYET);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingResponse.from(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getStatus() == BookingStatus.DA_HUY) {
            throw new BadRequestException("Booking đã được hủy trước đó");
        }

        if (booking.getStatus() == BookingStatus.HOAN_TAT) {
            throw new BadRequestException("Không thể hủy booking đã hoàn tất");
        }

        booking.setStatus(BookingStatus.DA_HUY);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingResponse.from(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (booking.getStatus() != BookingStatus.DA_DUYET) {
            throw new BadRequestException("Chỉ có thể hoàn tất booking đã được duyệt");
        }

        booking.setStatus(BookingStatus.HOAN_TAT);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingResponse.from(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        bookingRepository.delete(booking);
    }

    @Override
    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Booking booking = null;
        Field field = null;

        if (request.bookingId() != null) {
            booking = bookingRepository.findById(request.bookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.bookingId()));
            if (!booking.getUser().getId().equals(userId)) {
                throw new BadRequestException("Bạn không có quyền đánh giá booking này");
            }
            if (booking.getStatus() != BookingStatus.HOAN_TAT) {
                throw new BadRequestException("Chỉ có thể đánh giá booking đã hoàn tất");
            }
            field = booking.getField();
        } else if (request.fieldId() != null) {
            field = fieldRepository.findById(request.fieldId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field", "id", request.fieldId()));
        } else {
            throw new BadRequestException("Cần cung cấp bookingId hoặc fieldId");
        }

        Review review = new Review(booking, user, field, request.diemSo(), request.noiDung());
        Review savedReview = reviewRepository.save(review);

        return ReviewResponse.from(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByField(Long fieldId) {
        return reviewRepository.findByFieldIdOrderByNgayTaoDesc(fieldId).stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        reviewRepository.delete(review);
    }
}
