package com.banking.user.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class IdentityRegistry {

    private Long id;
    private String docType;
    private String docHash;
    private String fullName;
    private LocalDate dob;
}
