package com.banking.admin.service;


import com.banking.admin.config.FeignForceConfig;
import com.banking.admin.dto.LoanResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
@FeignClient(
        name = "loan",
        url = "http://localhost:8086"
)

public interface LoanClient {

    @PatchMapping("/api/loans/{id}/approve")
    LoanResponseDto approveLoan(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    );
}


