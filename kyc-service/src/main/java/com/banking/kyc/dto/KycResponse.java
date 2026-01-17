package com.banking.kyc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KycResponse {

    private String status;      // VERIFIED / REJECTED
    private int confidence;     // AI score
    private String message;
}
