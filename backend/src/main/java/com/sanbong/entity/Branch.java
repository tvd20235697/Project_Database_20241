package com.sanbong.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chi_nhanh")
public class Branch extends BaseEntity {

    @Column(name = "ten_chi_nhanh", nullable = false, unique = true)
    private String tenChiNhanh;

    @Column(nullable = false)
    private String diaChi;

    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Field> fields = new ArrayList<>();

    @OneToMany(mappedBy = "branch")
    private List<User> users = new ArrayList<>();

    public Branch() {
    }

    public Branch(String tenChiNhanh, String diaChi) {
        this.tenChiNhanh = tenChiNhanh;
        this.diaChi = diaChi;
    }

    public String getTenChiNhanh() {
        return tenChiNhanh;
    }

    public void setTenChiNhanh(String tenChiNhanh) {
        this.tenChiNhanh = tenChiNhanh;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void addField(Field field) {
        fields.add(field);
        field.setBranch(this);
    }

    public void removeField(Field field) {
        fields.remove(field);
        field.setBranch(null);
    }
}
