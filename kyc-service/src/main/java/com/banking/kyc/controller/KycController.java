package com.banking.kyc.controller;

import com.banking.kyc.dto.*;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.enums.KycStatus;
import com.banking.kyc.service.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private final OcrService ocrService;
    private final DocumentValidationService validationService;
    private final AiScoringService aiScoringService;

    @Autowired
    public KycController(
            OcrService ocrService,
            DocumentValidationService validationService,
            AiScoringService aiScoringService
    ) {
        this.ocrService = ocrService;
        this.validationService = validationService;
        this.aiScoringService = aiScoringService;
    }

    @PostMapping(
            value = "/verify",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public KycResponse verifyKyc(
            @RequestPart("data") String data,
            @RequestPart("image") MultipartFile image
    ) throws Exception {

        // 🔐 1️⃣ Get authenticated user from JWT
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = auth.getName(); // usually userId / email

        // 2️⃣ Parse request safely
        ObjectMapper mapper = new ObjectMapper();
        KycRequest request = mapper.readValue(data, KycRequest.class);

        // 3️⃣ Normalize document type
        DocumentType documentType =
                DocumentType.valueOf(request.getDocumentType().toUpperCase());

        // 4️⃣ Save image temporarily
        String originalName = image.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".png";

        File tempFile = File.createTempFile("kyc-", ext);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(image.getBytes());
        }

        // 5️⃣ OCR
        OcrResult ocrResult = ocrService.extractText(tempFile);
        tempFile.delete();

        // 6️⃣ Generate AI features
        KycFeatures features =
                validationService.generateFeatures(
                        documentType,
                        request.getName(),
                        request.getDob(),
                        request.getDocumentNumber(),
                        ocrResult.getExtractedText(),
                        ocrResult.getConfidence()
                );

        // 7️⃣ AI scoring
        int score = aiScoringService.calculateScore(features);

        // 8️⃣ Final decision
        KycStatus status =
                score >= 65 ? KycStatus.VERIFIED : KycStatus.REJECTED;

        // (Kafka event can be added here later)

        return new KycResponse(
                status.name(),
                score,
                status == KycStatus.VERIFIED
                        ? "KYC verified successfully"
                        : "KYC verification failed"
        );
    }
}
