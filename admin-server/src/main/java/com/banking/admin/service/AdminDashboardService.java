package com.banking.admin.service;

import com.banking.admin.dto.AdminDashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserClient userClient;
//    private final AccountClient accountClient;
    private final LoanClient loanClient;
//    private final TransactionClient transactionClient;

    public AdminDashboardResponse getDashboardData() {

        return AdminDashboardResponse.builder()

                .totalUsers(userClient.countUsers())

                .pendingKyc(userClient.countPendingKyc())

//                .pendingAccounts(accountClient.countPendingAccounts())

                .pendingLoans(loanClient.countPendingLoans())

//                .todayTransactions(
//                        transactionClient.countTodayTransactions()
//                )

//                .blockedUsers(userClient.countBlockedUsers())

                .build();
    }
}
