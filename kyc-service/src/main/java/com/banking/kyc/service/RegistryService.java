package com.banking.kyc.service;

import com.banking.kyc.repository.IdentityRegistryRepository;
import com.banking.kyc.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RegistryService {

    @Autowired
    private IdentityRegistryRepository repository;

    public boolean isIdentityValid(
            String docType,
            String docNumber,
            String name,
            String dob
    ) {
        String cleanDoc = docNumber.replaceAll("\\s+", "");
        String hash = HashUtil.sha256(cleanDoc);

        System.out.println("DOC = " + cleanDoc);
        System.out.println("HASH = " + hash);

        return repository
                .findByDocTypeAndDocHash(docType, hash)
                .filter(r -> r.getStatus().equalsIgnoreCase("ACTIVE"))
                .isPresent();
    }

}
