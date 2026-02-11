package com.banking.user.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class IdentityRegistry {

    private Long id;
    private String docType;
    private String docHash;
    private String fullName;
    private LocalDate dob;
    private String status;
}
