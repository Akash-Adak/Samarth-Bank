package com.banking.loan.controller;

import com.banking.loan.model.Loan;
import com.banking.loan.model.LoanRequestDto;
import com.banking.loan.model.LoanResponseDto;
import com.banking.loan.model.RepaymentDto;
import com.banking.loan.repository.LoanRepository;
import com.banking.loan.response.User;
import com.banking.loan.service.LoanService;
import com.banking.loan.service.RedisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/loans")

public class LoanController {
    @Autowired
    private  LoanService loanService;
    @Autowired
    private  RedisService redisService;
    @Autowired
    private LoanRepository loanRepository;
    // ✅ Apply for a loan (Only own account)
    @PostMapping
    public ResponseEntity<?> applyLoan(@Valid @RequestBody LoanRequestDto request , HttpServletRequest  request2) throws AccessDeniedException {


        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        String tokenWithBearer = request2.getHeader("Authorization");
        String token = tokenWithBearer.replaceFirst("(?i)^Bearer\\s+", "");
        return ResponseEntity.ok(loanService.applyLoan(request,jwtUsername,token));
    }




    // ✅ Get loans by account number (only own account)
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<?> byAccount(@PathVariable String accountNumber) {

        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(loanService.getLoansByAccountNumber(accountNumber));
    }


    // 🔐 Get Loan Details (ensures belonging to user)
    @GetMapping("/{loanId}")
    public ResponseEntity<?> getById(@PathVariable Long loanId) {

        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        LoanResponseDto dto = loanService.getLoanById(loanId);

        User user = redisService.get(dto.getAccountNumber(), User.class);

        if (user == null || !user.getUsername().equals(jwtUsername)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ You cannot access another user’s loan.");
        }

        return ResponseEntity.ok(dto);
    }


    // 🔐 Repay loan (Only for own loan)
    @PostMapping("/{loanId}repay")
    public ResponseEntity<?> repay(@PathVariable Long loanId,HttpServletRequest req) {

        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();


        String tokenWithBearer = req.getHeader("Authorization");
        String token = tokenWithBearer.replaceFirst("(?i)^Bearer\\s+", "");

        return ResponseEntity.ok(loanService.makeRepayment(loanId,jwtUsername,token));
    }


    @PatchMapping("/{loanId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long loanId) {
        return ResponseEntity.ok(loanService.approveLoan(loanId));
    }

    @PatchMapping("/{loanId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reject(@PathVariable Long loanId) {
        return ResponseEntity.ok(loanService.rejectLoan(loanId));
    }

    @GetMapping("/pending")
    public List<Loan> getPendingLoans() {
        return loanService.getPendingLoans();
    }

    @GetMapping("/pending/count")
    public Long getPendingLoansCount() {
        List<Loan> list =loanService.getPendingLoans();
        return list.size() > 0 ? (long) list.size() : 0L;
    }

    @GetMapping("/active")
    public List<Loan> getActiveLoans() {
        return loanService.getActiveLoans();
    }
}