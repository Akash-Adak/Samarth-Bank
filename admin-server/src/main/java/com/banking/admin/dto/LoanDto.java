package com.banking.admin.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LoanDto {
    private Long id;
    private String accountNumber;
    private LoanType loanType;
    private BigDecimal principalAmount;
    private double interestRate;
    private int tenureMonths;
    private BigDecimal emiAmount;
    private LoanStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
}
