package com.banking.kyc.service;


import java.io.File;

import com.banking.kyc.dto.OcrResult;
import org.springframework.stereotype.Service;


import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;

@Service
public class OcrService {

    public OcrResult extractText(File imageFile) {

        try {
            ITesseract tesseract = new Tesseract();


             tesseract.setDatapath("C:/Program Files/Tesseract-OCR/tessdata");

            tesseract.setLanguage("eng");

            String text = tesseract.doOCR(imageFile);

            int confidence = calculateConfidence(text);

            return new OcrResult(text, confidence);

        } catch (Exception e) {
            throw new RuntimeException("OCR failed", e);
        }
    }

    // Simple heuristic confidence (good enough for demo)
    private int calculateConfidence(String text) {
        if (text == null || text.length() < 20) return 40;
        if (text.length() < 50) return 60;
        return 85;
    }
}

