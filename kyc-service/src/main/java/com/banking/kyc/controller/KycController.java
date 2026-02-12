package com.banking.kyc.controller;

import com.banking.kyc.dto.KycResponse;
import com.banking.kyc.entity.IdentityRegistry;
import com.banking.kyc.service.KycVerificationService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private final KycVerificationService kycVerificationService;

    public KycController(KycVerificationService kycVerificationService) {
        this.kycVerificationService = kycVerificationService;
    }

    @PostMapping(
            value = "/verify",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public KycResponse verifyKyc(@RequestPart("data") String data, @RequestPart("image") MultipartFile image , HttpServletRequest request) throws KycVerificationService {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String token = request.getHeader("Authorization"); // Get the token from incoming request


        return kycVerificationService.verifyKyc(username,token, data, image);
    }
    @PostMapping("/addUserData")
    public String addUserData( @RequestBody IdentityRegistry registry, HttpServletRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username.equals(null)) {
            return "You cannot add data ";
        }
        System.out.println("from kyc controller "+registry);
        return kycVerificationService.addUserData( registry);
    }
}
