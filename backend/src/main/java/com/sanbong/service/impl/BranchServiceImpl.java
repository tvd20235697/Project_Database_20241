package com.sanbong.service.impl;

import com.sanbong.dto.request.BranchRequest;
import com.sanbong.dto.response.BranchResponse;
import com.sanbong.entity.Branch;
import com.sanbong.exception.BadRequestException;
import com.sanbong.exception.ResourceNotFoundException;
import com.sanbong.repository.BranchRepository;
import com.sanbong.service.interfaces.IBranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchServiceImpl implements IBranchService {

    private final BranchRepository branchRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(BranchResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
        return BranchResponse.from(branch);
    }

    @Override
    @Transactional
    public BranchResponse createBranch(BranchRequest request) {
        if (branchRepository.existsByTenChiNhanh(request.tenChiNhanh())) {
            throw new BadRequestException("Tên chi nhánh đã tồn tại");
        }

        Branch branch = new Branch(request.tenChiNhanh(), request.diaChi());
        Branch savedBranch = branchRepository.save(branch);
        return BranchResponse.from(savedBranch);
    }

    @Override
    @Transactional
    public BranchResponse updateBranch(Long id, BranchRequest request) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        if (!branch.getTenChiNhanh().equals(request.tenChiNhanh()) 
                && branchRepository.existsByTenChiNhanh(request.tenChiNhanh())) {
            throw new BadRequestException("Tên chi nhánh đã tồn tại");
        }

        branch.setTenChiNhanh(request.tenChiNhanh());
        branch.setDiaChi(request.diaChi());

        Branch updatedBranch = branchRepository.save(branch);
        return BranchResponse.from(updatedBranch);
    }

    @Override
    @Transactional
    public void deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
        branchRepository.delete(branch);
    }
}
