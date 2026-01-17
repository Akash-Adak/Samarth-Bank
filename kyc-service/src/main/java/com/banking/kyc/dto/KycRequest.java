package com.banking.kyc.dto;

import lombok.Data;

@Data
public class KycRequest {

    private Long userId;
    private String documentType;     // PAN / AADHAAR
    private String name;
    private String dob;              // yyyy-MM-dd
    private String documentNumber;
}
