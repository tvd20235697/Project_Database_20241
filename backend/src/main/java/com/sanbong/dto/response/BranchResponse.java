package com.sanbong.dto.response;

import com.sanbong.entity.Branch;

public record BranchResponse(
    Long id,
    String tenChiNhanh,
    String diaChi,
    int soSan
) {
    public static BranchResponse from(Branch branch) {
        return new BranchResponse(
            branch.getId(),
            branch.getTenChiNhanh(),
            branch.getDiaChi(),
            branch.getFields() != null ? branch.getFields().size() : 0
        );
    }
}
