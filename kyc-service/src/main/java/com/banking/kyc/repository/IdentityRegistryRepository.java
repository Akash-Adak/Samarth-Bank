package com.banking.kyc.repository;

import java.util.Optional;

import com.banking.kyc.entity.IdentityRegistry;
import org.springframework.data.jpa.repository.JpaRepository;


public interface IdentityRegistryRepository
        extends JpaRepository<IdentityRegistry, Long> {

    Optional<IdentityRegistry> findByDocTypeAndDocHash(
            String docType,
            String docHash
    );
}
