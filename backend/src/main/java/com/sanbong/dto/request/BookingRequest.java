package com.sanbong.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BookingRequest(
    @NotNull(message = "ID sân không được để trống")
    Long fieldId,

    @NotNull(message = "ID khung giờ không được để trống")
    Long timeSlotId,

    @NotNull(message = "Ngày đặt không được để trống")
    LocalDate ngay,

    String ghiChu
) {}
