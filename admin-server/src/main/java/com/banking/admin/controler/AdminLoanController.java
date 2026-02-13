package com.banking.admin.controler;


import com.banking.admin.dto.LoanResponseDto;
import com.banking.admin.service.LoanClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
public class AdminLoanController {

    private final LoanClient loanClient;

    @PatchMapping("/{id}/approve")
    public ResponseEntity<LoanResponseDto> approveLoan(@PathVariable Long id, HttpServletRequest request) {
        LoanResponseDto response =loanClient.approveLoan(id);
        return ResponseEntity.ok(response);
    }
}
