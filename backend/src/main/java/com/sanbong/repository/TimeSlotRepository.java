package com.sanbong.repository;

import com.sanbong.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    @Query("SELECT ts FROM TimeSlot ts WHERE ts.field.id = :fieldId")
    List<TimeSlot> findByFieldId(@Param("fieldId") Long fieldId);

    @Query("SELECT ts FROM TimeSlot ts WHERE ts.field.id = :fieldId AND ts.trangThai = true")
    List<TimeSlot> findByFieldIdAndTrangThaiTrue(@Param("fieldId") Long fieldId);

    @Query("SELECT ts FROM TimeSlot ts WHERE ts.field.id = :fieldId AND ts.gioBatDau = :gioBatDau")
    Optional<TimeSlot> findByFieldIdAndGioBatDau(@Param("fieldId") Long fieldId, @Param("gioBatDau") LocalTime gioBatDau);

    boolean existsByFieldIdAndGioBatDau(Long fieldId, LocalTime gioBatDau);
}
