package com.sanbong.dto.response;

import java.math.BigDecimal;

public record RevenueSummary(
    BigDecimal todayRevenue,
    int todayBookings,
    BigDecimal monthRevenue,
    int monthBookings,
    BigDecimal yearRevenue,
    int yearBookings
) {
    public static RevenueSummary of(BigDecimal todayRevenue, int todayBookings, 
                                    BigDecimal monthRevenue, int monthBookings,
                                    BigDecimal yearRevenue, int yearBookings) {
        return new RevenueSummary(todayRevenue, todayBookings, monthRevenue, monthBookings, yearRevenue, yearBookings);
    }
}
