package com.banking.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long pendingKyc;

    private Long pendingAccounts;

    private Long pendingLoans;

    private Long todayTransactions;

    private Long blockedUsers;
    private Long activeLoans;
}
