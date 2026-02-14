package com.banking.admin.controler;

import com.banking.admin.dto.AdminDashboardResponse;
import com.banking.admin.dto.LoanDto;
import com.banking.admin.dto.LoanResponseDto;
import com.banking.admin.service.AdminDashboardService;
import com.banking.admin.service.LoanClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService service;

    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }
    private final LoanClient loanClient;

    @PatchMapping("/loans/{id}/approve")
    public ResponseEntity<LoanResponseDto> approveLoan(@PathVariable Long id, HttpServletRequest request) {
        LoanResponseDto response =loanClient.approveLoan(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/loans/{id}/reject")
    public ResponseEntity<LoanResponseDto> rejectLoan(@PathVariable Long id, HttpServletRequest request) {
        LoanResponseDto response =loanClient.rejectLoan(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/loans/pending")
    public List<LoanDto> getPendingLoans() {
        return loanClient.getPendingLoans();
    }
}
