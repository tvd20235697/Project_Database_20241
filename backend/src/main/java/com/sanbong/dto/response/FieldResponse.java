package com.sanbong.dto.response;

import com.sanbong.entity.Field;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public record FieldResponse(
    Long id,
    String tenSan,
    String loaiSan,
    BigDecimal giaSan,
    Boolean trangThai,
    Long branchId,
    String tenChiNhanh,
    List<TimeSlotResponse> timeSlots,
    Double avgRating,
    int reviewCount
) {
    public static FieldResponse from(Field field) {
        return new FieldResponse(
            field.getId(),
            field.getTenSan(),
            field.getLoaiSan(),
            field.getGiaSan(),
            field.getTrangThai(),
            field.getBranch() != null ? field.getBranch().getId() : null,
            field.getBranch() != null ? field.getBranch().getTenChiNhanh() : null,
            field.getTimeSlots() != null
                ? field.getTimeSlots().stream().map(TimeSlotResponse::from).collect(Collectors.toList())
                : List.of(),
            null,
            field.getReviews() != null ? field.getReviews().size() : 0
        );
    }

    public static FieldResponse from(Field field, Double avgRating) {
        return new FieldResponse(
            field.getId(),
            field.getTenSan(),
            field.getLoaiSan(),
            field.getGiaSan(),
            field.getTrangThai(),
            field.getBranch() != null ? field.getBranch().getId() : null,
            field.getBranch() != null ? field.getBranch().getTenChiNhanh() : null,
            field.getTimeSlots() != null
                ? field.getTimeSlots().stream().map(TimeSlotResponse::from).collect(Collectors.toList())
                : List.of(),
            avgRating,
            field.getReviews() != null ? field.getReviews().size() : 0
        );
    }

    public static FieldResponse fromBasic(Field field) {
        return new FieldResponse(
            field.getId(),
            field.getTenSan(),
            field.getLoaiSan(),
            field.getGiaSan(),
            field.getTrangThai(),
            field.getBranch() != null ? field.getBranch().getId() : null,
            field.getBranch() != null ? field.getBranch().getTenChiNhanh() : null,
            null,
            null,
            field.getReviews() != null ? field.getReviews().size() : 0
        );
    }
}
