package com.sanbong.controller.admin;

import com.sanbong.dto.request.TimeSlotRequest;
import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.TimeSlotResponse;
import com.sanbong.service.interfaces.IFieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/timeslots")
@RequiredArgsConstructor
public class TimeSlotAdminController {

    private final IFieldService fieldService;

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> updateTimeSlot(
            @PathVariable Long id,
            @Valid @RequestBody TimeSlotRequest request) {
        TimeSlotResponse timeSlot = fieldService.updateTimeSlot(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khung giờ thành công", timeSlot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTimeSlot(@PathVariable Long id) {
        fieldService.deleteTimeSlot(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khung giờ thành công", null));
    }
}
