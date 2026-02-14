package com.banking.loan.repository;



import com.banking.loan.model.Loan;
import com.banking.loan.model.LoanStatus;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByAccountNumber(String accountNumber);
    @Query(
            value = "SELECT email FROM users WHERE account_number = :accountNumber",
            nativeQuery = true
    )
    String findEmailByAccountNumber(@Param("accountNumber") String accountNumber);

    @Query("""
    SELECT l.principalAmount
    FROM Loan l
    WHERE l.id = :loanId
""")
   Optional <BigDecimal> findPrincipalAmountByLoanId(
            @Param("loanId") Long loanId
    );



    List<Loan> findByAccountNumberAndStatus(String accountNumber, LoanStatus status);

    List<Loan> findByStatus(LoanStatus status);
}


