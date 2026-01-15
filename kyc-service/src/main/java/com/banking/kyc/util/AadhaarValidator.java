package com.banking.kyc.util;

import java.util.regex.Pattern;

public class AadhaarValidator {

    // Aadhaar regex (12 digits, starts with 2–9)
    private static final Pattern AADHAAR_PATTERN =
            Pattern.compile("[2-9]{1}[0-9]{11}");

    public static boolean isValidAadhaar(String aadhaar) {

        if (aadhaar == null) return false;

        aadhaar = aadhaar.replaceAll("\\s+", "");

        return AADHAAR_PATTERN.matcher(aadhaar).matches();
    }

    public static double keywordScore(String ocrText) {

        if (ocrText == null) return 0;

        ocrText = ocrText.toUpperCase();

        int score = 0;

        if (ocrText.contains("GOVERNMENT OF INDIA")) score++;
        if (ocrText.contains("AADHAAR")) score++;
        if (ocrText.contains("UIDAI")) score++;

        return score / 3.0; // 0.0 – 1.0
    }
}

