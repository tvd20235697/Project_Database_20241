package com.sanbong.service.impl;

import com.sanbong.dto.request.FieldRequest;
import com.sanbong.dto.request.TimeSlotRequest;
import com.sanbong.dto.response.AvailabilityResponse;
import com.sanbong.dto.response.FieldResponse;
import com.sanbong.dto.response.TimeSlotResponse;
import com.sanbong.entity.Booking;
import com.sanbong.entity.Branch;
import com.sanbong.entity.Field;
import com.sanbong.entity.TimeSlot;
import com.sanbong.exception.BadRequestException;
import com.sanbong.exception.ResourceNotFoundException;
import com.sanbong.repository.BookingRepository;
import com.sanbong.repository.BranchRepository;
import com.sanbong.repository.FieldRepository;
import com.sanbong.repository.ReviewRepository;
import com.sanbong.repository.TimeSlotRepository;
import com.sanbong.service.interfaces.IFieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FieldServiceImpl implements IFieldService {

    private final FieldRepository fieldRepository;
    private final BranchRepository branchRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FieldResponse> getAllFields() {
        return fieldRepository.findAll().stream()
                .map(field -> {
                    Double avgRating = reviewRepository.findAvgDiemSoByField(field.getId());
                    return FieldResponse.from(field, avgRating);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FieldResponse> getAvailableFields() {
        return fieldRepository.findByTrangThaiTrue().stream()
                .map(field -> {
                    Double avgRating = reviewRepository.findAvgDiemSoByField(field.getId());
                    return FieldResponse.from(field, avgRating);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FieldResponse> getFieldsByBranch(Long branchId) {
        return fieldRepository.findByBranchId(branchId).stream()
                .map(field -> {
                    Double avgRating = reviewRepository.findAvgDiemSoByField(field.getId());
                    return FieldResponse.from(field, avgRating);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FieldResponse getFieldById(Long id) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        Double avgRating = reviewRepository.findAvgDiemSoByField(id);
        return FieldResponse.from(field, avgRating);
    }

    @Override
    @Transactional
    public FieldResponse createField(FieldRequest request) {
        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", request.branchId()));

        Field field = new Field(
                request.tenSan(),
                request.loaiSan(),
                request.giaSan(),
                branch
        );

        if (request.trangThai() != null) {
            field.setTrangThai(request.trangThai());
        }

        Field savedField = fieldRepository.save(field);
        return FieldResponse.from(savedField);
    }

    @Override
    @Transactional
    public FieldResponse updateField(Long id, FieldRequest request) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));

        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", request.branchId()));

        field.setTenSan(request.tenSan());
        field.setLoaiSan(request.loaiSan());
        field.setGiaSan(request.giaSan());
        field.setBranch(branch);

        if (request.trangThai() != null) {
            field.setTrangThai(request.trangThai());
        }

        Field updatedField = fieldRepository.save(field);
        Double avgRating = reviewRepository.findAvgDiemSoByField(id);
        return FieldResponse.from(updatedField, avgRating);
    }

    @Override
    @Transactional
    public void deleteField(Long id) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        fieldRepository.delete(field);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getTimeSlotsByField(Long fieldId) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new ResourceNotFoundException("Field", "id", fieldId);
        }
        return timeSlotRepository.findByFieldId(fieldId).stream()
                .map(TimeSlotResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TimeSlotResponse createTimeSlot(Long fieldId, TimeSlotRequest request) {
        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", fieldId));

        if (timeSlotRepository.existsByFieldIdAndGioBatDau(fieldId, request.gioBatDau())) {
            throw new BadRequestException("Khung giờ này đã tồn tại cho sân này");
        }

        TimeSlot timeSlot = new TimeSlot(request.gioBatDau(), request.gioKetThuc(), field);
        if (request.trangThai() != null) {
            timeSlot.setTrangThai(request.trangThai());
        }

        TimeSlot savedTimeSlot = timeSlotRepository.save(timeSlot);
        return TimeSlotResponse.from(savedTimeSlot);
    }

    @Override
    @Transactional
    public TimeSlotResponse updateTimeSlot(Long id, TimeSlotRequest request) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", id));

        if (!timeSlot.getGioBatDau().equals(request.gioBatDau()) 
                && timeSlotRepository.existsByFieldIdAndGioBatDau(timeSlot.getField().getId(), request.gioBatDau())) {
            throw new BadRequestException("Khung giờ này đã tồn tại cho sân này");
        }

        timeSlot.setGioBatDau(request.gioBatDau());
        timeSlot.setGioKetThuc(request.gioKetThuc());

        if (request.trangThai() != null) {
            timeSlot.setTrangThai(request.trangThai());
        }

        TimeSlot updatedTimeSlot = timeSlotRepository.save(timeSlot);
        return TimeSlotResponse.from(updatedTimeSlot);
    }

    @Override
    @Transactional
    public void deleteTimeSlot(Long id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", id));
        timeSlotRepository.delete(timeSlot);
    }

    @Override
    @Transactional(readOnly = true)
    public AvailabilityResponse getFieldAvailability(Long fieldId, LocalDate date) {
        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", fieldId));

        List<TimeSlot> allTimeSlots = timeSlotRepository.findByFieldIdAndTrangThaiTrue(fieldId);
        List<Booking> bookedBookings = bookingRepository.findByFieldIdAndNgay(fieldId, date)
                .stream()
                .filter(b -> b.getStatus() != com.sanbong.enums.BookingStatus.DA_HUY)
                .toList();

        List<Long> bookedTimeSlotIds = bookedBookings.stream()
                .map(b -> b.getTimeSlot().getId())
                .toList();

        Map<Long, String> bookedBy = new HashMap<>();
        for (Booking booking : bookedBookings) {
            bookedBy.put(booking.getTimeSlot().getId(), booking.getUser().getHoTen());
        }

        List<TimeSlotResponse> availableSlots = allTimeSlots.stream()
                .filter(ts -> !bookedTimeSlotIds.contains(ts.getId()))
                .map(ts -> TimeSlotResponse.from(ts, false))
                .collect(Collectors.toList());

        List<TimeSlotResponse> bookedSlots = allTimeSlots.stream()
                .filter(ts -> bookedTimeSlotIds.contains(ts.getId()))
                .map(ts -> TimeSlotResponse.from(ts, true))
                .collect(Collectors.toList());

        return AvailabilityResponse.of(fieldId, field.getTenSan(), date, availableSlots, bookedSlots, bookedBy);
    }
}
