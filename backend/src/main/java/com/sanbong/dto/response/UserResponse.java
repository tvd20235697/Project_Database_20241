package com.sanbong.dto.response;

import com.sanbong.entity.User;
import com.sanbong.enums.Role;

public record UserResponse(
    Long id,
    String hoTen,
    String email,
    String soDienThoai,
    Role role,
    Long branchId,
    String branchName
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getHoTen(),
            user.getEmail(),
            user.getSoDienThoai(),
            user.getRole(),
            user.getBranch() != null ? user.getBranch().getId() : null,
            user.getBranch() != null ? user.getBranch().getTenChiNhanh() : null
        );
    }
}
