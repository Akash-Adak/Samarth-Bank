package com.banking.kyc.service;



import com.banking.kyc.dto.KycFeatures;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.util.*;
import org.springframework.beans.factory.annotation.Autowired;
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

        // 🔹 NEW PART
        String ocrName = OcrFieldExtractor.extractName(ocrText);
        String ocrDob = OcrFieldExtractor.extractDob(ocrText);

        double nameSimilarity =
                NameSimilarityUtil.calculate(typedName, ocrName);

        boolean dobMatch =
                DobMatcher.match(typedDob, ocrDob);

        return KycFeatures.builder()
                .ocrConfidence(ocrConfidence)
                .validStructure(validStructure)
                .nameSimilarity(nameSimilarity)
                .dobMatch(dobMatch)
                .keywordScore(keywordScore)
                .registryMatch(true) // fake registry next step
                .build();
    }

}
