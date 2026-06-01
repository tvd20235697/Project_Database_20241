package com.sanbong.repository;

import com.sanbong.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.field.id = :fieldId ORDER BY r.ngayTao DESC")
    List<Review> findByFieldIdOrderByNgayTaoDesc(@Param("fieldId") Long fieldId);

    Optional<Review> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.diemSo) FROM Review r WHERE r.field.id = :fieldId")
    Double findAvgDiemSoByField(@Param("fieldId") Long fieldId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.field.id = :fieldId")
    int countByField(@Param("fieldId") Long fieldId);
}
