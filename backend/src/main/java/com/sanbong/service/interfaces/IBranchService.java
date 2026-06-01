package com.sanbong.service.interfaces;

import com.sanbong.dto.request.BranchRequest;
import com.sanbong.dto.response.BranchResponse;

import java.util.List;

public interface IBranchService {
    
    List<BranchResponse> getAllBranches();
    
    BranchResponse getBranchById(Long id);
    
    BranchResponse createBranch(BranchRequest request);
    
    BranchResponse updateBranch(Long id, BranchRequest request);
    
    void deleteBranch(Long id);
}
