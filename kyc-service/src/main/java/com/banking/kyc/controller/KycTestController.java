package com.banking.kyc.controller;

import com.banking.kyc.dto.KycFeatures;
import com.banking.kyc.enums.KycStatus;
import com.banking.kyc.service.AiScoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KycTestController {

    @Autowired
    private AiScoringService aiScoringService;

    @GetMapping("/test-ai")
    public String testAi() {

        // Fake extracted data (simulating OCR + validation)
        KycFeatures features = KycFeatures.builder()
                .ocrConfidence(85)
                .validStructure(true)
                .nameSimilarity(0.92)
                .dobMatch(true)
                .keywordScore(0.90)
                .registryMatch(true)
                .build();

        int score = aiScoringService.calculateScore(features);

        KycStatus status =
                score >= 80 ? KycStatus.VERIFIED : KycStatus.REJECTED;

        return "AI Score = " + score + " | Status = " + status;
    }
}
