package com.sanbong.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record FieldRequest(
    @NotBlank(message = "Tên sân không được để trống")
    String tenSan,

    @NotBlank(message = "Loại sân không được để trống")
    String loaiSan,

    @NotNull(message = "Giá sân không được để trống")
    @DecimalMin(value = "0.0", message = "Giá sân phải lớn hơn hoặc bằng 0")
    BigDecimal giaSan,

    @NotNull(message = "ID chi nhánh không được để trống")
    Long branchId,

    Boolean trangThai
) {}
