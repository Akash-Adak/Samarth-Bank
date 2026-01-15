package com.banking.kyc.util;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class OcrFieldExtractor {

    private static final Pattern DOB_PATTERN =
            Pattern.compile("\\d{2}/\\d{2}/\\d{4}");

    public static String extractDob(String text) {

        if (text == null) return null;

        Matcher matcher = DOB_PATTERN.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    public static String extractName(String text) {

        if (text == null) return null;

        String[] lines = text.split("\\n");

        for (String line : lines) {
            if (line.toUpperCase().contains("NAME")) {
                return line.replaceAll("(?i)name", "").trim();
            }
        }
        return null;
    }
}

