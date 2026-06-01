package com.sanbong.entity;

import com.sanbong.enums.BookingStatus;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "dat_san",
       uniqueConstraints = @UniqueConstraint(columnNames = {"san_id", "khung_gio_codinh_id", "ngay"}))
public class Booking extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "san_id", nullable = false)
    private Field field;

    @ManyToOne
    @JoinColumn(name = "khung_gio_codinh_id", nullable = false)
    private TimeSlot timeSlot;

    @Column(nullable = false)
    private LocalDate ngay;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CHO_DUYET;

    @Column
    private String ghiChu;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;

    public Booking() {
    }

    public Booking(User user, Field field, TimeSlot timeSlot, LocalDate ngay, String ghiChu) {
        this.user = user;
        this.field = field;
        this.timeSlot = timeSlot;
        this.ngay = ngay;
        this.ghiChu = ghiChu;
        this.status = BookingStatus.CHO_DUYET;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    public LocalDate getNgay() {
        return ngay;
    }

    public void setNgay(LocalDate ngay) {
        this.ngay = ngay;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }
}
