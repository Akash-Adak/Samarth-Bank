package com.banking.kyc.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DobMatcher {

    public static boolean match(String typedDob, String ocrDob) {

        if (typedDob == null || ocrDob == null) {
            return false;
        }

        try {
            LocalDate typed =
                    LocalDate.parse(typedDob);

            LocalDate ocr =
                    LocalDate.parse(ocrDob, DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            return typed.equals(ocr);

        } catch (Exception e) {
            return false;
        }
    }
}
