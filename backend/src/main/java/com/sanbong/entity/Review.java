package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "danh_gia")
public class Review extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "booking_id", unique = true)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "san_id", nullable = false)
    private Field field;

    @Column(name = "diem_so", nullable = false)
    private Integer diemSo;

    @Column(columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDate ngayTao;

    public Review() {
    }

    public Review(Booking booking, User user, Field field, Integer diemSo, String noiDung) {
        this.booking = booking;
        this.user = user;
        this.field = field;
        this.diemSo = diemSo;
        this.noiDung = noiDung;
        this.ngayTao = LocalDate.now();
    }

    @PrePersist
    protected void onCreate() {
        if (ngayTao == null) {
            ngayTao = LocalDate.now();
        }
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
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

    public Integer getDiemSo() {
        return diemSo;
    }

    public void setDiemSo(Integer diemSo) {
        this.diemSo = diemSo;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }

    public LocalDate getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDate ngayTao) {
        this.ngayTao = ngayTao;
    }
}
