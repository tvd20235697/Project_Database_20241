package com.sanbong.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record AvailabilityResponse(
    Long fieldId,
    String tenSan,
    LocalDate date,
    List<TimeSlotResponse> timeSlots,
    List<Long> bookedSlotIds,
    Map<Long, String> bookedBy
) {
    public static AvailabilityResponse of(Long fieldId, String tenSan, LocalDate date,
                                          List<TimeSlotResponse> availableSlots,
                                          List<TimeSlotResponse> bookedSlots,
                                          Map<Long, String> bookedBy) {
        List<Long> bookedIds = bookedSlots.stream()
            .map(TimeSlotResponse::id)
            .toList();
        List<TimeSlotResponse> allSlots = new java.util.ArrayList<>(availableSlots);
        allSlots.addAll(bookedSlots);
        return new AvailabilityResponse(fieldId, tenSan, date, allSlots, bookedIds, bookedBy);
    }
}
