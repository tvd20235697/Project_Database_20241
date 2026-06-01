package com.sanbong.service.interfaces;

import com.sanbong.dto.request.FieldRequest;
import com.sanbong.dto.request.TimeSlotRequest;
import com.sanbong.dto.response.AvailabilityResponse;
import com.sanbong.dto.response.FieldResponse;
import com.sanbong.dto.response.TimeSlotResponse;

import java.time.LocalDate;
import java.util.List;

public interface IFieldService {
    
    List<FieldResponse> getAllFields();
    
    List<FieldResponse> getAvailableFields();
    
    List<FieldResponse> getFieldsByBranch(Long branchId);
    
    FieldResponse getFieldById(Long id);
    
    FieldResponse createField(FieldRequest request);
    
    FieldResponse updateField(Long id, FieldRequest request);
    
    void deleteField(Long id);
    
    List<TimeSlotResponse> getTimeSlotsByField(Long fieldId);
    
    TimeSlotResponse createTimeSlot(Long fieldId, TimeSlotRequest request);
    
    TimeSlotResponse updateTimeSlot(Long id, TimeSlotRequest request);
    
    void deleteTimeSlot(Long id);
    
    AvailabilityResponse getFieldAvailability(Long fieldId, LocalDate date);
}
