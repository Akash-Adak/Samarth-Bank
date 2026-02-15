package com.banking.user.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;

@Data
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
    private  String userStatus;
}
