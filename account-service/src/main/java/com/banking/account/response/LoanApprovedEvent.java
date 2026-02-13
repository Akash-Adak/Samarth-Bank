package com.banking.account.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoanApprovedEvent {

    private Long loanId;
    private String accountNumber;
    private BigDecimal amount;
}
