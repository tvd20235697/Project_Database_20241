package com.sanbong.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "san")
public class Field extends BaseEntity {

    @Column(name = "ten_san", nullable = false)
    private String tenSan;

    @Column(name = "loai_san", nullable = false)
    private String loaiSan;

    @Column(name = "gia_san", nullable = false, precision = 10, scale = 2)
    private BigDecimal giaSan;

    @Column(columnDefinition = "TINYINT(1) default 1")
    private Boolean trangThai = true;

    @ManyToOne
    @JoinColumn(name = "chi_nhanh_id", nullable = false)
    private Branch branch;

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeSlot> timeSlots = new ArrayList<>();

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Field() {
    }

    public Field(String tenSan, String loaiSan, BigDecimal giaSan, Branch branch) {
        this.tenSan = tenSan;
        this.loaiSan = loaiSan;
        this.giaSan = giaSan;
        this.branch = branch;
    }

    public String getTenSan() {
        return tenSan;
    }

    public void setTenSan(String tenSan) {
        this.tenSan = tenSan;
    }

    public String getLoaiSan() {
        return loaiSan;
    }

    public void setLoaiSan(String loaiSan) {
        this.loaiSan = loaiSan;
    }

    public BigDecimal getGiaSan() {
        return giaSan;
    }

    public void setGiaSan(BigDecimal giaSan) {
        this.giaSan = giaSan;
    }

    public Boolean getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Boolean trangThai) {
        this.trangThai = trangThai;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public List<TimeSlot> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(List<TimeSlot> timeSlots) {
        this.timeSlots = timeSlots;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public void addTimeSlot(TimeSlot timeSlot) {
        timeSlots.add(timeSlot);
        timeSlot.setField(this);
    }

    public void removeTimeSlot(TimeSlot timeSlot) {
        timeSlots.remove(timeSlot);
        timeSlot.setField(null);
    }
}
