package com.sanbong.service.impl;

import com.sanbong.dto.response.RevenueResponse;
import com.sanbong.dto.response.RevenueSummary;
import com.sanbong.entity.Booking;
import com.sanbong.enums.BookingStatus;
import com.sanbong.repository.BookingRepository;
import com.sanbong.repository.FieldRepository;
import com.sanbong.service.interfaces.IRevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueServiceImpl implements IRevenueService {

    private final BookingRepository bookingRepository;
    private final FieldRepository fieldRepository;

    @Override
    @Transactional(readOnly = true)
    public RevenueResponse getMonthlyRevenue(int year) {
        List<RevenueResponse.MonthlyRevenue> monthlyRevenues = new ArrayList<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        int totalBookings = 0;

        for (int month = 1; month <= 12; month++) {
            LocalDate startOfMonth = LocalDate.of(year, month, 1);
            LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);

            List<Booking> monthBookings = bookingRepository.findByStatusAndDateRange(
                    BookingStatus.HOAN_TAT, startOfMonth, endOfMonth);

            BigDecimal monthRevenue = monthBookings.stream()
                    .map(b -> b.getField().getGiaSan())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            monthlyRevenues.add(new RevenueResponse.MonthlyRevenue(month, monthRevenue, monthBookings.size()));
            totalRevenue = totalRevenue.add(monthRevenue);
            totalBookings += monthBookings.size();
        }

        return RevenueResponse.of(year, monthlyRevenues, totalRevenue, totalBookings);
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueSummary getRevenueSummary() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate startOfYear = today.withDayOfYear(1);

        BigDecimal todayRevenue = bookingRepository.calculateRevenue(today, today);
        int todayBookings = bookingRepository.countCompletedBookings(today, today);

        BigDecimal monthRevenue = bookingRepository.calculateRevenue(startOfMonth, today);
        int monthBookings = bookingRepository.countCompletedBookings(startOfMonth, today);

        BigDecimal yearRevenue = bookingRepository.calculateRevenue(startOfYear, today);
        int yearBookings = bookingRepository.countCompletedBookings(startOfYear, today);

        return RevenueSummary.of(
                todayRevenue != null ? todayRevenue : BigDecimal.ZERO,
                todayBookings,
                monthRevenue != null ? monthRevenue : BigDecimal.ZERO,
                monthBookings,
                yearRevenue != null ? yearRevenue : BigDecimal.ZERO,
                yearBookings
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTopFields(int limit) {
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.HOAN_TAT);

        Map<Long, Map<String, Object>> fieldStats = new LinkedHashMap<>();

        for (Booking booking : completedBookings) {
            Long fieldId = booking.getField().getId();
            if (!fieldStats.containsKey(fieldId)) {
                Map<String, Object> stats = new LinkedHashMap<>();
                stats.put("fieldId", fieldId);
                stats.put("tenSan", booking.getField().getTenSan());
                stats.put("branchName", booking.getField().getBranch().getTenChiNhanh());
                stats.put("revenue", BigDecimal.ZERO);
                stats.put("bookingCount", 0);
                fieldStats.put(fieldId, stats);
            }
            Map<String, Object> stats = fieldStats.get(fieldId);
            BigDecimal rev = (BigDecimal) stats.get("revenue");
            stats.put("revenue", rev.add(booking.getField().getGiaSan()));
            stats.put("bookingCount", ((Integer) stats.get("bookingCount")) + 1);
        }

        return fieldStats.values().stream()
                .sorted((a, b) -> {
                    BigDecimal ra = (BigDecimal) b.get("revenue");
                    BigDecimal rb = (BigDecimal) a.get("revenue");
                    return ra.compareTo(rb);
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTopBranches(int limit) {
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.HOAN_TAT);

        Map<Long, Map<String, Object>> branchStats = new LinkedHashMap<>();

        for (Booking booking : completedBookings) {
            Long branchId = booking.getField().getBranch().getId();
            if (!branchStats.containsKey(branchId)) {
                Map<String, Object> stats = new LinkedHashMap<>();
                stats.put("branchId", branchId);
                stats.put("tenChiNhanh", booking.getField().getBranch().getTenChiNhanh());
                stats.put("revenue", BigDecimal.ZERO);
                stats.put("bookingCount", 0);
                branchStats.put(branchId, stats);
            }
            Map<String, Object> stats = branchStats.get(branchId);
            BigDecimal rev = (BigDecimal) stats.get("revenue");
            stats.put("revenue", rev.add(booking.getField().getGiaSan()));
            stats.put("bookingCount", ((Integer) stats.get("bookingCount")) + 1);
        }

        return branchStats.values().stream()
                .sorted((a, b) -> {
                    BigDecimal ra = (BigDecimal) b.get("revenue");
                    BigDecimal rb = (BigDecimal) a.get("revenue");
                    return ra.compareTo(rb);
                })
                .limit(limit)
                .collect(Collectors.toList());
    }
}
