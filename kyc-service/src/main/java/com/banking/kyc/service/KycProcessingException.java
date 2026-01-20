package com.banking.kyc.service;

public class KycProcessingException extends RuntimeException {
    public KycProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}
