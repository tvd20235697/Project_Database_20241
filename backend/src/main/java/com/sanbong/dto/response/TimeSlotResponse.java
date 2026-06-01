package com.sanbong.dto.response;

import com.sanbong.entity.TimeSlot;
import java.time.LocalTime;

public record TimeSlotResponse(
    Long id,
    LocalTime gioBatDau,
    LocalTime gioKetThuc,
    String khungGio,
    Boolean trangThai,
    boolean daDat
) {
    public static TimeSlotResponse from(TimeSlot timeSlot) {
        return new TimeSlotResponse(
            timeSlot.getId(),
            timeSlot.getGioBatDau(),
            timeSlot.getGioKetThuc(),
            timeSlot.getKhungGio(),
            timeSlot.getTrangThai(),
            false
        );
    }

    public static TimeSlotResponse from(TimeSlot timeSlot, boolean daDat) {
        return new TimeSlotResponse(
            timeSlot.getId(),
            timeSlot.getGioBatDau(),
            timeSlot.getGioKetThuc(),
            timeSlot.getKhungGio(),
            timeSlot.getTrangThai(),
            daDat
        );
    }
}
