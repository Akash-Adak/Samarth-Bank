package com.banking.kyc.service;



import com.banking.kyc.dto.KycFeatures;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.util.AadhaarValidator;
import com.banking.kyc.util.PanValidator;
import org.springframework.stereotype.Service;
;

@Service
public class DocumentValidationService {

    public KycFeatures generateFeatures(
            DocumentType docType,
            String typedName,
            String typedDob,
            String typedDocNumber,
            String ocrText,
            int ocrConfidence
    ) {

        boolean validStructure = false;
        double keywordScore = 0;

        if (docType == DocumentType.PAN) {
            validStructure = PanValidator.isValidPan(typedDocNumber);
            keywordScore = PanValidator.keywordScore(ocrText);
        }

        if (docType == DocumentType.AADHAAR) {
            validStructure = AadhaarValidator.isValidAadhaar(typedDocNumber);
            keywordScore = AadhaarValidator.keywordScore(ocrText);
        }

        return KycFeatures.builder()
                .ocrConfidence(ocrConfidence)
                .validStructure(validStructure)
                .nameSimilarity(1.0)     // will add real logic later
                .dobMatch(true)          // will add real logic later
                .keywordScore(keywordScore)
                .registryMatch(true)     // fake registry comes later
                .build();
    }
}
