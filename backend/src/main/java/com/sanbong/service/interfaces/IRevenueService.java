package com.sanbong.service.interfaces;

import com.sanbong.dto.response.RevenueResponse;
import com.sanbong.dto.response.RevenueSummary;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IRevenueService {
    
    RevenueResponse getMonthlyRevenue(int year);
    
    RevenueSummary getRevenueSummary();
    
    List<Map<String, Object>> getTopFields(int limit);
    
    List<Map<String, Object>> getTopBranches(int limit);
}
