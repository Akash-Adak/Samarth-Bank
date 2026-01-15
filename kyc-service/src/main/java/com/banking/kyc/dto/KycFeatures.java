package com.banking.kyc.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KycFeatures {

    private int ocrConfidence;          // 0–100
    private boolean validStructure;     // PAN/Aadhaar format
    private double nameSimilarity;      // 0–1
    private boolean dobMatch;            // true/false
    private double keywordScore;         // 0–1
    private boolean registryMatch;       // true/false
}

