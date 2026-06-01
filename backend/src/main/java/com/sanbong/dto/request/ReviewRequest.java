package com.sanbong.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
    Long bookingId,

    Long fieldId,

    @NotNull(message = "Điểm số không được để trống")
    @Min(value = 1, message = "Điểm số phải từ 1 đến 5")
    @Max(value = 5, message = "Điểm số phải từ 1 đến 5")
    Integer diemSo,

    String noiDung
) {}
