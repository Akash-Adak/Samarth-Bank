package com.banking.admin.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LoanResponseDto {

    private Long id;
    private String status;
    private Double principalAmount;
    private Integer tenureMonths;
    private LocalDate startDate;
    private LocalDate endDate;
}
