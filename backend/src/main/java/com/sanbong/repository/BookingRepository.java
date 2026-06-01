package com.sanbong.repository;

import com.sanbong.entity.Booking;
import com.sanbong.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId")
    List<Booking> findByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = :status")
    List<Booking> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.field.id = :fieldId")
    List<Booking> findByFieldId(@Param("fieldId") Long fieldId);

    @Query("SELECT b FROM Booking b WHERE b.field.id = :fieldId AND b.ngay = :ngay")
    List<Booking> findByFieldIdAndNgay(@Param("fieldId") Long fieldId, @Param("ngay") LocalDate ngay);

    @Query("SELECT b FROM Booking b WHERE b.ngay BETWEEN :startDate AND :endDate")
    List<Booking> findByNgayBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.field.id = :fieldId AND b.timeSlot.id = :timeSlotId AND b.ngay = :ngay AND b.status <> 'DA_HUY'")
    Optional<Booking> findActiveBooking(@Param("fieldId") Long fieldId, @Param("timeSlotId") Long timeSlotId, @Param("ngay") LocalDate ngay);

    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.ngay BETWEEN :startDate AND :endDate")
    List<Booking> findByStatusAndDateRange(@Param("status") BookingStatus status, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(b.field.giaSan), 0) FROM Booking b WHERE b.status = 'HOAN_TAT' AND b.ngay BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'HOAN_TAT' AND b.ngay BETWEEN :startDate AND :endDate")
    int countCompletedBookings(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b WHERE b.ngay = :ngay AND b.status <> 'DA_HUY'")
    List<Booking> findBookingsForDate(@Param("ngay") LocalDate ngay);
}
