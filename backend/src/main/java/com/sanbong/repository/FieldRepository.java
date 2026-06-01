package com.sanbong.repository;

import com.sanbong.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldRepository extends JpaRepository<Field, Long> {

    @Query("SELECT f FROM Field f WHERE f.branch.id = :branchId")
    List<Field> findByBranchId(@Param("branchId") Long branchId);

    List<Field> findByLoaiSan(String loaiSan);

    @Query("SELECT f FROM Field f WHERE f.branch.id = :branchId AND f.loaiSan = :loaiSan")
    List<Field> findByBranchIdAndLoaiSan(@Param("branchId") Long branchId, @Param("loaiSan") String loaiSan);

    List<Field> findByTrangThaiTrue();

    @Query("SELECT f FROM Field f WHERE f.trangThai = true AND f.branch.id = :branchId")
    List<Field> findAvailableFieldsByBranch(@Param("branchId") Long branchId);
}
