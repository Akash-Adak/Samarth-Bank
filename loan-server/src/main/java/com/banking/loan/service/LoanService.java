package com.banking.loan.service;

import com.banking.loan.model.Loan;
import com.banking.loan.model.LoanRequestDto;
import com.banking.loan.model.LoanResponseDto;
import com.banking.loan.model.RepaymentDto;
import jakarta.validation.Valid;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface LoanService {

    LoanResponseDto applyLoan(LoanRequestDto request,String username,String token) throws AccessDeniedException;



;

    List<LoanResponseDto> getLoansByAccountNumber(String accountNumber);

    LoanResponseDto getLoanById(Long id);

    LoanResponseDto makeRepayment(Long loanId,String username,String token);

//    Object applyxdLoan(@Valid LoanRequestDto request);


    LoanResponseDto approveLoan(Long loanId);
    LoanResponseDto rejectLoan(Long loanId);
    List<Loan> getPendingLoans();


}