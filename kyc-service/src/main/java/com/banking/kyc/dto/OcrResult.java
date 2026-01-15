package com.banking.kyc.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OcrResult {

    private String extractedText;
    private int confidence; // 0–100
}

