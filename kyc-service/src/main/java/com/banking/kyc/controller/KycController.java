package com.banking.kyc.controller;

import com.banking.kyc.dto.KycResponse;
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
    public KycResponse verifyKyc(@RequestPart("data") String data, @RequestPart("image") MultipartFile image , HttpServletRequest request) throws KycVerificationService.KycProcessingException {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String token = request.getHeader("Authorization"); // Get the token from incoming request


        return kycVerificationService.verifyKyc(username,token, data, image);
    }
}
