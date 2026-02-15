package com.banking.admin.service;


import com.banking.admin.config.FeignForceConfig;
import com.banking.admin.dto.LoanDto;
import com.banking.admin.dto.LoanResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(
        name = "loan",
        url = "http://localhost:8086",
        configuration = FeignForceConfig.class
)
public interface LoanClient {

    @PatchMapping("/api/loans/{id}/approve")
    LoanResponseDto approveLoan(@PathVariable Long id);

    @GetMapping("/api/loans/pending")
    List<LoanDto> getPendingLoans();

    @GetMapping("/api/loans/pending/count")
    Long countPendingLoans();

    @GetMapping("/api/loans/active/count")
    Long countActiveLoans();

    @PatchMapping("/api/loans/{id}/reject")
    LoanResponseDto rejectLoan(Long id);

    @GetMapping("/api/loans/active")
    List<LoanDto> getActiveLoans();
}



