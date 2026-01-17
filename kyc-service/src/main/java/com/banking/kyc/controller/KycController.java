package com.banking.kyc.controller;

import java.io.File;
import java.io.FileOutputStream;

import com.banking.kyc.dto.*;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.enums.KycStatus;
import com.banking.kyc.service.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    @Autowired
    private OcrService ocrService;

    @Autowired
    private DocumentValidationService validationService;

    @Autowired
    private AiScoringService aiScoringService;

    @PostMapping(value = "/verify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public KycResponse verifyKyc(
            @RequestPart("data") String data,
            @RequestPart("image") MultipartFile image
    ) throws Exception {

        // 1️⃣ Parse JSON safely
        ObjectMapper mapper = new ObjectMapper();
        KycRequest request = mapper.readValue(data, KycRequest.class);

        // 2️⃣ Normalize document type (CRITICAL FIX)
        DocumentType documentType =
                DocumentType.valueOf(request.getDocumentType().toUpperCase());

        // 3️⃣ Save image temporarily (safe extension handling)
        String originalName = image.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".png";

        File tempFile = File.createTempFile("kyc-", ext);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(image.getBytes());
        }

        // 4️⃣ OCR
        OcrResult ocrResult = ocrService.extractText(tempFile);
        tempFile.delete();

        // 5️⃣ Generate AI features
        KycFeatures features =
                validationService.generateFeatures(
                        documentType,
                        request.getName(),
                        request.getDob(),
                        request.getDocumentNumber(),
                        ocrResult.getExtractedText(),
                        ocrResult.getConfidence()
                );

        // 🔍 DEBUG LOGS (VERY IMPORTANT)
        System.out.println("----- KYC DEBUG -----");
        System.out.println("DOC TYPE   : " + documentType);
        System.out.println("OCR CONF   : " + features.getOcrConfidence());
        System.out.println("STRUCTURE : " + features.isValidStructure());
        System.out.println("NAME SIM  : " + features.getNameSimilarity());
        System.out.println("DOB MATCH : " + features.isDobMatch());
        System.out.println("KEYWORDS  : " + features.getKeywordScore());
        System.out.println("REGISTRY  : " + features.isRegistryMatch());
        System.out.println("---------------------");

        // 6️⃣ AI scoring
        int score = aiScoringService.calculateScore(features);

        // 🔧 DEMO-FRIENDLY THRESHOLD (FIX)
        KycStatus status =
                score >= 65 ? KycStatus.VERIFIED : KycStatus.REJECTED;

        // 7️⃣ Response
        return new KycResponse(
                status.name(),
                score,
                status == KycStatus.VERIFIED
                        ? "KYC verified successfully"
                        : "KYC verification failed"
        );
    }
}
