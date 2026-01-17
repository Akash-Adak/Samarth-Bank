package com.banking.kyc.util;

import java.security.MessageDigest;

public class HashUtil {

    public static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes());

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException("Hashing failed");
        }
    }
}
