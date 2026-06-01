package com.sanbong.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record RevenueResponse(
    int year,
    List<MonthlyRevenue> monthlyRevenue,
    BigDecimal totalRevenue,
    int totalBookings
) {
    public record MonthlyRevenue(
        int month,
        BigDecimal revenue,
        int bookingCount
    ) {}

    public static RevenueResponse of(int year, List<MonthlyRevenue> monthlyRevenue, BigDecimal totalRevenue, int totalBookings) {
        return new RevenueResponse(year, monthlyRevenue, totalRevenue, totalBookings);
    }
}
