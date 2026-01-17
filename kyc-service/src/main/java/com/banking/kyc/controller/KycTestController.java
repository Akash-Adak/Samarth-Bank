package com.banking.kyc.controller;

import com.banking.kyc.dto.KycFeatures;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.enums.KycStatus;
import com.banking.kyc.service.AiScoringService;
import com.banking.kyc.service.DocumentValidationService;
import com.banking.kyc.service.RegistryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KycTestController {

    @Autowired
    private AiScoringService aiScoringService;
    @Autowired
   private RegistryService registryService;


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

    @Autowired
    private DocumentValidationService validationService;

    @GetMapping("/test-doc")
    public String testDocumentValidation() {

        KycFeatures features =
                validationService.generateFeatures(
                        DocumentType.PAN,
                        "Rahul Sharma",
                        "1999-08-12",
                        "APSDE1234F",
                        "INCOME TAX DEPARTMENT GOVT OF INDIA PAN",
                        85
                );

        int score = aiScoringService.calculateScore(features);

        return "Score = " + score;
    }

    @GetMapping("/test-name-dob")
    public String testNameDob() {

        String ocrText =
                "INCOME TAX DEPARTMENT\n" +
                        "Name: RAHUL SHARMA\n" +
                        "DOB: 12/08/1999\n" +
                        "PAN: ABCDE1234F";

        KycFeatures features =
                validationService.generateFeatures(
                        DocumentType.PAN,
                        "Rahul Sharma",
                        "1999-08-12",
                        "ABCDE1234F",
                        ocrText,
                        85
                );

        int score = aiScoringService.calculateScore(features);

        return "Score=" + score +
                " NameSimilarity=" + features.getNameSimilarity() +
                " DobMatch=" + features.isDobMatch();
    }

    @GetMapping("/test-registry")
    public String testRegistry() {

        boolean result =
                registryService.isIdentityValid(
                        "PAN",
                        "ABCDE1234F",
                        "Rahul Sharma",
                        "1999-08-12"
                );

        return "Registry Match = " + result;
    }


}
