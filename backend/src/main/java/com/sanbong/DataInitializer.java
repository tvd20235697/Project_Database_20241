package com.sanbong;

import com.sanbong.entity.*;
import com.sanbong.enums.BookingStatus;
import com.sanbong.enums.Role;
import com.sanbong.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final FieldRepository fieldRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // 1. Create admin user
        User admin = new User("Administrator", "admin@sanbong.com",
                passwordEncoder.encode("admin123"), "0969272243", Role.ADMIN);
        userRepository.save(admin);

        // 2. Create branches
        Branch b1 = new Branch("Chi nhánh Cầu Giấy", "Số 123 Đường Xuân Thủy, Cầu Giấy, Hà Nội");
        Branch b2 = new Branch("Chi nhánh Thanh Xuân", "Số 456 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội");
        branchRepository.saveAll(List.of(b1, b2));

        // 3. Create fields
        Field f1 = new Field("Sân A1", "5 người", new BigDecimal("150000"), b1);
        Field f2 = new Field("Sân A2", "5 người", new BigDecimal("150000"), b1);
        Field f3 = new Field("Sân B1", "7 người", new BigDecimal("250000"), b2);
        Field f4 = new Field("Sân B2", "7 người", new BigDecimal("250000"), b2);
        fieldRepository.saveAll(List.of(f1, f2, f3, f4));

        // 4. Create time slots for each field (7h-22h)
        for (Field field : List.of(f1, f2, f3, f4)) {
            for (int h = 7; h < 22; h++) {
                TimeSlot ts = new TimeSlot(LocalTime.of(h, 0), LocalTime.of(h + 1, 0), field);
                timeSlotRepository.save(ts);
            }
        }

        System.out.println("=== Seed data initialized ===");
        System.out.println("Admin: admin@sanbong.com / admin123");
    }
}
