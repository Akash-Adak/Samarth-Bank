package com.banking.kyc.service;

import com.banking.kyc.dto.KycFeatures;
import org.springframework.stereotype.Service;


@Service
public class AiScoringService {

    public int calculateScore(KycFeatures f) {

        double score = 0;

        // 30% weight
        score += 0.30 * f.getOcrConfidence();

        // 20% weight
        score += 0.20 * (f.isValidStructure() ? 100 : 0);

        // 20% weight
        score += 0.20 * (f.getNameSimilarity() * 100);

        // 15% weight
        score += 0.15 * (f.isDobMatch() ? 100 : 0);

        // 10% weight
        score += 0.10 * (f.getKeywordScore() * 100);

        // 5% weight
        score += 0.05 * (f.isRegistryMatch() ? 100 : 0);

        return (int) Math.round(score);
    }
}
