package com.banking.kyc.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "identity_registry")
@Data
public class IdentityRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String docType;    // PAN / AADHAAR
    private String docHash;
    private String fullName;
    private LocalDate dob;
    private String status;     // ACTIVE / BLOCKED
}
