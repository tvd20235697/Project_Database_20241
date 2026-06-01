package com.sanbong.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BranchRequest(
    @NotBlank(message = "Tên chi nhánh không được để trống")
    String tenChiNhanh,

    @NotBlank(message = "Địa chỉ không được để trống")
    String diaChi
) {}
