package com.banking.kyc.dto;

import lombok.Data;

@Data
public class KycRequest {

    private String email;
    private String documentType;     // PAN / AADHAAR
    private String name;
    private String dob;              // yyyy-MM-dd
    private String documentNumber;
}
