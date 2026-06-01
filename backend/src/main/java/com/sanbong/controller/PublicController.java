package com.sanbong.controller;

import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.AvailabilityResponse;
import com.sanbong.dto.response.BranchResponse;
import com.sanbong.dto.response.FieldResponse;
import com.sanbong.service.interfaces.IBranchService;
import com.sanbong.service.interfaces.IFieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final IFieldService fieldService;
    private final IBranchService branchService;

    @GetMapping("/fields")
    public ResponseEntity<ApiResponse<List<FieldResponse>>> getAvailableFields(
            @RequestParam(required = false) Long branchId) {
        List<FieldResponse> fields;
        if (branchId != null) {
            fields = fieldService.getFieldsByBranch(branchId);
        } else {
            fields = fieldService.getAvailableFields();
        }
        return ResponseEntity.ok(ApiResponse.success(fields));
    }

    @GetMapping("/fields/{id}")
    public ResponseEntity<ApiResponse<FieldResponse>> getFieldDetails(@PathVariable Long id) {
        FieldResponse field = fieldService.getFieldById(id);
        return ResponseEntity.ok(ApiResponse.success(field));
    }

    @GetMapping("/fields/{id}/availability")
    public ResponseEntity<ApiResponse<AvailabilityResponse>> getFieldAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AvailabilityResponse availability = fieldService.getFieldAvailability(id, date);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    @GetMapping("/branches")
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAllBranches() {
        List<BranchResponse> branches = branchService.getAllBranches();
        return ResponseEntity.ok(ApiResponse.success(branches));
    }
}
