package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "khung_gio_co_dinh",
       uniqueConstraints = @UniqueConstraint(columnNames = {"san_id", "gio_bat_dau"}))
public class TimeSlot extends BaseEntity {

    @Column(name = "gio_bat_dau", nullable = false)
    private LocalTime gioBatDau;

    @Column(name = "gio_ket_thuc", nullable = false)
    private LocalTime gioKetThuc;

    @ManyToOne
    @JoinColumn(name = "san_id", nullable = false)
    private Field field;

    @Column(columnDefinition = "TINYINT(1) default 1")
    private Boolean trangThai = true;

    public TimeSlot() {
    }

    public TimeSlot(LocalTime gioBatDau, LocalTime gioKetThuc, Field field) {
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.field = field;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public LocalTime getGioKetThuc() {
        return gioKetThuc;
    }

    public void setGioKetThuc(LocalTime gioKetThuc) {
        this.gioKetThuc = gioKetThuc;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public Boolean getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Boolean trangThai) {
        this.trangThai = trangThai;
    }

    public String getKhungGio() {
        return String.format("%02d:00 - %02d:00", gioBatDau.getHour(), gioKetThuc.getHour());
    }
}
