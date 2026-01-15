package com.banking.kyc.util;

import org.apache.commons.text.similarity.JaroWinklerSimilarity;

public class NameSimilarityUtil {

    private static final JaroWinklerSimilarity similarity =
            new JaroWinklerSimilarity();

    public static double calculate(String typedName, String ocrName) {

        if (typedName == null || ocrName == null) {
            return 0.0;
        }

        typedName = clean(typedName);
        ocrName = clean(ocrName);

        return similarity.apply(typedName, ocrName);
    }

    private static String clean(String name) {
        return name.toUpperCase()
                .replaceAll("[^A-Z ]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }
}

