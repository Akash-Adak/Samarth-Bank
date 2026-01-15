package com.banking.kyc.util;


import java.util.regex.Pattern;

public class PanValidator {

    // PAN regex
    private static final Pattern PAN_PATTERN =
            Pattern.compile("[A-Z]{5}[0-9]{4}[A-Z]");

    public static boolean isValidPan(String pan) {

        if (pan == null) return false;

        pan = pan.trim().toUpperCase();

        // Pattern check
        if (!PAN_PATTERN.matcher(pan).matches()) {
            return false;
        }

        // 4th character must be 'P' (individual)
        return pan.charAt(3) == 'P';
    }

    public static double keywordScore(String ocrText) {

        if (ocrText == null) return 0;

        ocrText = ocrText.toUpperCase();

        int score = 0;

        if (ocrText.contains("INCOME TAX")) score++;
        if (ocrText.contains("GOVT")) score++;
        if (ocrText.contains("PAN")) score++;

        return score / 3.0; // 0.0 – 1.0
    }
}

