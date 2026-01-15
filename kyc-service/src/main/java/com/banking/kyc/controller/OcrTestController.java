package com.banking.kyc.controller;


import java.io.File;
import java.io.FileOutputStream;

import com.banking.kyc.dto.OcrResult;
import com.banking.kyc.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;



@RestController
public class OcrTestController {

    @Autowired
    private OcrService ocrService;

    @PostMapping(value = "/test-ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public OcrResult testOcr(@RequestParam("image") MultipartFile file) throws Exception {

        // Save file temporarily
        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".png";

        File tempFile = File.createTempFile("kyc-", extension);

        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }

        OcrResult result = ocrService.extractText(tempFile);

        // Delete temp file
        tempFile.delete();

        return result;
    }
}
