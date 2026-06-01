package com.sanbong.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record TimeSlotRequest(
    @NotNull(message = "Giờ bắt đầu không được để trống")
    LocalTime gioBatDau,

    @NotNull(message = "Giờ kết thúc không được để trống")
    LocalTime gioKetThuc,

    Boolean trangThai
) {}
