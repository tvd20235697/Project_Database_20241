package com.sanbong.controller.admin;

import com.sanbong.dto.request.FieldRequest;
import com.sanbong.dto.request.TimeSlotRequest;
import com.sanbong.dto.response.ApiResponse;
import com.sanbong.dto.response.FieldResponse;
import com.sanbong.dto.response.TimeSlotResponse;
import com.sanbong.service.interfaces.IFieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fields")
@RequiredArgsConstructor
public class FieldController {

    private final IFieldService fieldService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FieldResponse>>> getAllFields() {
        List<FieldResponse> fields = fieldService.getAllFields();
        return ResponseEntity.ok(ApiResponse.success(fields));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FieldResponse>> getFieldById(@PathVariable Long id) {
        FieldResponse field = fieldService.getFieldById(id);
        return ResponseEntity.ok(ApiResponse.success(field));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FieldResponse>> createField(
            @Valid @RequestBody FieldRequest request) {
        FieldResponse field = fieldService.createField(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo sân thành công", field));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FieldResponse>> updateField(
            @PathVariable Long id,
            @Valid @RequestBody FieldRequest request) {
        FieldResponse field = fieldService.updateField(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sân thành công", field));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteField(@PathVariable Long id) {
        fieldService.deleteField(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sân thành công", null));
    }

    @GetMapping("/{fieldId}/timeslots")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getTimeSlots(
            @PathVariable Long fieldId) {
        List<TimeSlotResponse> timeSlots = fieldService.getTimeSlotsByField(fieldId);
        return ResponseEntity.ok(ApiResponse.success(timeSlots));
    }

    @PostMapping("/{fieldId}/timeslots")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> createTimeSlot(
            @PathVariable Long fieldId,
            @Valid @RequestBody TimeSlotRequest request) {
        TimeSlotResponse timeSlot = fieldService.createTimeSlot(fieldId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo khung giờ thành công", timeSlot));
    }

}
