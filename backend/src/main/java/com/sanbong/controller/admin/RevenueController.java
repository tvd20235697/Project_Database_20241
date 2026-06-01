package com.sanbong.controller.admin;

import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.RevenueResponse;
import com.sanbong.dto.response.RevenueSummary;
import com.sanbong.service.interfaces.IRevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final IRevenueService revenueService;

    @GetMapping
    public ResponseEntity<ApiResponse<RevenueResponse>> getMonthlyRevenue(
            @RequestParam(required = false) Integer year) {
        int targetYear = year != null ? year : java.time.LocalDate.now().getYear();
        RevenueResponse revenue = revenueService.getMonthlyRevenue(targetYear);
        return ResponseEntity.ok(ApiResponse.success(revenue));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<RevenueSummary>> getRevenueSummary() {
        RevenueSummary summary = revenueService.getRevenueSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/top-fields")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopFields(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> topFields = revenueService.getTopFields(limit);
        return ResponseEntity.ok(ApiResponse.success(topFields));
    }

    @GetMapping("/top-branches")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopBranches(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> topBranches = revenueService.getTopBranches(limit);
        return ResponseEntity.ok(ApiResponse.success(topBranches));
    }
}
