package com.banking.admin.controler;

import com.banking.admin.dto.AdminDashboardResponse;
import com.banking.admin.dto.LoanDto;
import com.banking.admin.dto.LoanResponseDto;
import com.banking.admin.dto.UserModel;
import com.banking.admin.service.AdminDashboardService;
import com.banking.admin.service.LoanClient;
import com.banking.admin.service.UserClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {
    @Autowired
    private final AdminDashboardService service;
    @Autowired
    private final UserClient userClient;
    @Autowired
    private final LoanClient loanClient;




    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }


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

    @GetMapping("/user/details")
    public List<UserModel> getUserList() {
        return userClient.getUserList();
    }

    @GetMapping("/loans/active")
    public List<LoanDto> getActiveLoans() {
        return loanClient.getActiveLoans();
    }

    @PatchMapping("/user/block/{accountNumber}")
    public ResponseEntity<String> blockUser(@PathVariable String accountNumber) {
        ResponseEntity<String>  u= userClient.blockUser(accountNumber);
        return ResponseEntity.ok("User blocked successfully");
    }


}
