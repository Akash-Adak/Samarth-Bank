package com.banking.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String phone;
    private String address;
    private String kycStatus;
    private String accountNumber;
    private String docType;    // PAN / AADHAAR
    private String docHash;
    private LocalDate dob;
}
