package com.sanbong.repository;

import com.sanbong.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    
    Optional<Branch> findByTenChiNhanh(String tenChiNhanh);
    
    boolean existsByTenChiNhanh(String tenChiNhanh);
}
